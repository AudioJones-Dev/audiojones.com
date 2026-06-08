// Server-side MailerLite integration helper.
// Uses the MailerLite Connect API (https://connect.mailerlite.com).
// Segmentation on Connect is by group ID — there is no /tags endpoint.

interface UpsertSubscriberParams {
  email: string;
  groupId?: string;
  name?: string;
  /**
   * @deprecated The Connect API has no `/tags` endpoint. Pass `groupId`
   * with a MailerLite group ID instead. Retained so legacy callers
   * compile while they migrate.
   */
  tag?: string;
}

export interface UpsertSubscriberResult {
  ok: boolean;
  error?:
    | 'missing-email'
    | 'missing-token'
    | 'upstream-error'
    | 'network-error';
  status?: number;
}

export async function upsertMailerLiteSubscriber(
  params: UpsertSubscriberParams
): Promise<UpsertSubscriberResult> {
  const { email, groupId, name, tag } = params;

  if (tag && !groupId) {
    console.warn(
      '[mailerlite] `tag` is deprecated and has no effect on Connect API; pass `groupId` (MailerLite group ID).'
    );
  }

  if (!email) {
    console.log('[mailerlite] No email provided, skipping');
    return { ok: false, error: 'missing-email' };
  }

  const token = process.env.MAILERLITE_TOKEN;
  if (!token) {
    console.error('[mailerlite] MAILERLITE_TOKEN not configured');
    return { ok: false, error: 'missing-token' };
  }

  const body: Record<string, unknown> = {
    email,
    fields: { name: name ?? '' },
    status: 'active',
  };
  if (groupId) {
    body.groups = [groupId];
  }

  try {
    const response = await fetch(
      'https://connect.mailerlite.com/api/subscribers',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(
        '[mailerlite] Subscriber upsert failed:',
        response.status,
        detail
      );
      return { ok: false, error: 'upstream-error', status: response.status };
    }

    console.log(
      '[mailerlite] Subscriber upserted:',
      email,
      groupId ? `(group ${groupId})` : '(no group)'
    );
    return { ok: true };
  } catch (error) {
    console.error('[mailerlite] Request failed:', error);
    return { ok: false, error: 'network-error' };
  }
}
