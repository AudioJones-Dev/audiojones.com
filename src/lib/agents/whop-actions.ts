import { env } from "@aj/config";
import { getWhopClient } from "@aj/whop";
import { executeMCPTool } from "@/lib/mcp/whop";

/**
 * OpenAI AgentKit integration for Audio Jones automation
 * Enables AI agents to perform complex tasks using Whop APIs and MCP tools
 */

export interface AgentAction {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

/**
 * Customer onboarding agent
 */
export const customerOnboardingAgent: AgentAction = {
  name: "customer_onboarding",
  description: "Handle new customer onboarding workflow",
  parameters: {
    customer_email: { type: "string", required: true },
    product_id: { type: "string", required: true },
    customer_name: { type: "string", required: false }
  },
  execute: async ({ customer_email, product_id, customer_name }) => {
    const whopClient = getWhopClient();
    
    // 1. Send welcome notification
    await whopClient.notifications.create({
      company_id: env.NEXT_PUBLIC_WHOP_COMPANY_ID,
      title: "Welcome to Audio Jones!",
      content: `Hi ${customer_name || customer_email}! Welcome to the Audio Jones community. We're excited to help you grow your brand with AI-powered marketing.`,
      rest_path: "/onboarding/welcome"
    });
    
    // 2. Create welcome forum post
    // Note: This would need the experience_id for the customer's community
    
    // 3. Trigger N8N onboarding workflow
    if (env.N8N_WEBHOOK_URL) {
      await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "customer_onboarding_started",
          customer_email,
          product_id,
          customer_name,
          timestamp: new Date().toISOString()
        })
      });
    }
    
    return {
      success: true,
      message: "Customer onboarding initiated",
      customer: {
        email: customer_email,
        product_id,
        name: customer_name,
        status: "onboarding_started"
      }
    };
  }
};

/**
 * Monthly report generation agent
 */
export const monthlyReportAgent: AgentAction = {
  name: "generate_monthly_report",
  description: "Generate monthly business and customer reports",
  parameters: {
    month: { type: "string", required: true }, // YYYY-MM format
    include_payments: { type: "boolean", default: true },
    include_customers: { type: "boolean", default: true }
  },
  execute: async ({ month, include_payments = true, include_customers = true }) => {
    const whopClient = getWhopClient();
    const report: any = {
      month,
      generated_at: new Date().toISOString(),
      summary: {}
    };
    
    if (include_payments) {
      // Get payments for the month
      const paymentsResult = await executeMCPTool({
        name: "list_payments",
        arguments: {
          company_id: env.NEXT_PUBLIC_WHOP_COMPANY_ID,
          limit: 100 // Adjust as needed
        }
      });
      
      if (paymentsResult.success && paymentsResult.data) {
        // Filter and analyze payments for the month
        const monthPayments = paymentsResult.data.data?.filter((payment: any) => 
          payment.created_at?.startsWith(month)
        ) || [];
        
        report.payments = {
          total_count: monthPayments.length,
          total_amount: monthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
          payments: monthPayments
        };
        
        report.summary.payments = `${monthPayments.length} payments totaling $${(report.payments.total_amount / 100).toFixed(2)}`;
      }
    }
    
    // Send report notification to team
    await whopClient.notifications.create({
      company_id: env.NEXT_PUBLIC_WHOP_COMPANY_ID,
      title: `Monthly Report - ${month}`,
      content: `Monthly report generated: ${report.summary.payments || 'No payment data'}`,
      rest_path: `/reports/monthly/${month}`
    });
    
    return report;
  }
};

/**
 * Customer support agent
 */
export const customerSupportAgent: AgentAction = {
  name: "customer_support",
  description: "Handle customer support requests and access issues",
  parameters: {
    customer_email: { type: "string", required: true },
    issue_type: { type: "string", required: true }, // access, billing, technical, etc.
    experience_id: { type: "string", required: false }
  },
  execute: async ({ customer_email, issue_type, experience_id }) => {
    const whopClient = getWhopClient();
    
    const resolution: any = {
      issue_type,
      customer_email,
      resolved: false,
      actions_taken: []
    };
    
    switch (issue_type) {
      case "access":
        if (experience_id) {
          // Check current access status
          const accessResult = await executeMCPTool({
            name: "get_user_access",
            arguments: {
              user_id: customer_email, // Assuming email as user identifier
              experience_id
            }
          });
          
          resolution.current_access = accessResult.data;
          resolution.actions_taken.push("Checked access status");
          
          if (!accessResult.success || !accessResult.data?.has_access) {
            // Send notification about access issue
            await whopClient.notifications.create({
              company_id: env.NEXT_PUBLIC_WHOP_COMPANY_ID,
              title: "Access Issue Reported",
              content: `Customer ${customer_email} is experiencing access issues for experience ${experience_id}`,
              rest_path: `/support/access/${customer_email}`
            });
            
            resolution.actions_taken.push("Escalated access issue to team");
          }
        }
        break;
        
      case "billing":
        // Get customer's payment history
        const paymentsResult = await executeMCPTool({
          name: "list_payments",
          arguments: {
            company_id: env.NEXT_PUBLIC_WHOP_COMPANY_ID,
            limit: 50
          }
        });
        
        if (paymentsResult.success) {
          // Filter payments for this customer (would need better customer identification)
          resolution.recent_payments = paymentsResult.data?.data?.slice(0, 5);
          resolution.actions_taken.push("Retrieved payment history");
        }
        break;
        
      default:
        resolution.actions_taken.push("Issue type not automatically handled - escalated to human support");
    }
    
    // Log support ticket
    if (env.N8N_WEBHOOK_URL) {
      await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "support_ticket_created",
          customer_email,
          issue_type,
          experience_id,
          resolution,
          timestamp: new Date().toISOString()
        })
      });
    }
    
    return resolution;
  }
};

/**
 * Available agent actions
 */
export const AGENT_ACTIONS = [
  customerOnboardingAgent,
  monthlyReportAgent,
  customerSupportAgent
] as const;

/**
 * Execute agent action by name
 */
export async function executeAgentAction(name: string, parameters: any) {
  const action = AGENT_ACTIONS.find(a => a.name === name);
  
  if (!action) {
    throw new Error(`Unknown agent action: ${name}`);
  }
  
  // Validate required parameters
  for (const [param, config] of Object.entries(action.parameters)) {
    if ((config as any).required && !(param in parameters)) {
      throw new Error(`Missing required parameter: ${param}`);
    }
  }
  
  return await action.execute(parameters);
}

/**
 * OpenAI function definitions for AgentKit
 */
export const OPENAI_FUNCTIONS = AGENT_ACTIONS.map(action => ({
  name: action.name,
  description: action.description,
  parameters: {
    type: "object",
    properties: action.parameters,
    required: Object.entries(action.parameters)
      .filter(([_, config]) => (config as any).required)
      .map(([param, _]) => param)
  }
}));