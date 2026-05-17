import type { PostStub, TopicClusterSlug } from "@/lib/sanity/types";

export type LocalBlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  topicCluster: {
    title: string;
    slug: TopicClusterSlug;
  };
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  answerSummary: string;
  body: string[];
};

export const LOCAL_BLOG_POSTS: LocalBlogPost[] = [
  {
    _id: "local-break-the-loop",
    slug: "break-the-loop",
    title: "Break the Loop",
    excerpt:
      "A founder-led note on AI, ADHD, optimization loops, and the discipline required to turn intelligence into shipped work.",
    publishedAt: "2026-05-17T12:00:00.000Z",
    topicCluster: {
      title: "Signal vs Noise",
      slug: "signal-vs-noise",
    },
    focusKeyword: "AI shipping discipline",
    seoTitle: "Break the Loop | Audio Jones Blog",
    seoDescription:
      "A founder-led reflection on AI development loops, optimization as procrastination, and how to turn frameworks into shipped work.",
    answerSummary:
      "The loop breaks when new information stops becoming another rebuild and starts becoming a decision, constraint, or shipped action.",
    body: [
      "Today is Sunday, May 17, and I’m preparing for the work week.",
      "I’m also sitting inside one of the most honest realizations I’ve had since I started building with AI: I have been building a lot, but I have not been shipping enough.",
      "I finally made the commitment to pay for the Claude Max plan. I’m excited about it. I’m using Claude Code, Codex, ChatGPT, Obsidian, and these new AI development workflows. I’ve vibe-coded my website. I’ve built projects. I’ve created frameworks. I’ve mapped systems. I’ve developed ideas that, on paper, have real potential.",
      "But outside of my website, not enough has actually gone to market.",
      "That forced me to ask a harder question:",
      "Why am I still stuck in the loop?",
      "The loop is not lack of intelligence. It is not lack of tools. It is not lack of ideas. It is not even lack of effort.",
      "The loop is when every new piece of information feels like the missing piece.",
      "Every morning, I wake up and check what’s new in AI. A new feature ships. A new tool drops. A new workflow gets explained. A creator shares a better way to use agents, prompts, Claude Code, Codex, memory, knowledge bases, project folders, or automation.",
      "And because the information feels relevant, I immediately try to integrate it.",
      "That is where the loop starts.",
      "I tell myself, “This will make the build better.”",
      "Then I open another folder. Start another document. Create another protocol. Refine another framework. Add another layer. Rework another architecture. Ask for another sanity test.",
      "Then the day passes.",
      "The next morning, I’m back asking the same question:",
      "Where am I in the build?",
      "That was the real signal.",
      "Not the new tool. Not the new framework. Not the new workflow.",
      "The signal was that I kept losing my footing.",
      "And that was humbling, because the very thing I’m trying to help founders solve is the same thing I was struggling with myself.",
      "I talk about clarity. I talk about systems. I talk about signal over noise. I talk about getting founders out of operational chaos and into deployment.",
      "But I had to admit something:",
      "I was not fully practicing what I preach.",
      "I had frameworks, but no operating discipline. I had tools, but no containment. I had ideas, but no shipping rhythm. I had intelligence, but not enough closure.",
      "Then Claude called me out.",
      "I had been taking outputs from ChatGPT, throwing them into Claude, taking Claude outputs, throwing them back into ChatGPT, and assuming that because the models had context, I was making progress.",
      "But I was not always engaging with the material deeply enough. I was passing information between tools without converting that information into action, decisions, constraints, or shipped work.",
      "That was the rude awakening.",
      "The problem was not that AI was failing me.",
      "The problem was that I was using AI to extend the loop.",
      "That is when it became less about AI tools and more about psychology.",
      "Because for me, as someone who is neurodivergent and has ADHD, there has to be some grace. But grace does not remove responsibility. It just helps explain the pattern without turning it into shame.",
      "The loop had a structure:",
      "New information. New excitement. New implementation. New project folder. New uncertainty. New sanity check. No market deployment.",
      "Once I saw that, I could finally name it.",
      "And once I could name it, I could start breaking it.",
      "But the deeper realization came later.",
      "As I continued working with Claude, I started having these breakthroughs in real time. Claude asked me to create a priority list and focus only on the immediate tasks in front of me.",
      "No new tools. No new frameworks. No new ideas.",
      "Just finish what already existed.",
      "And even while having that realization, I was still committing the exact behavior that created the loop in the first place.",
      "I would discover a new insight about myself and immediately think:",
      "“The website needs another overhaul.” “This changes everything.” “This is the missing piece.”",
      "Meanwhile, the original task was simple:",
      "Go audit the repo. Find out how close the site actually is to shipping. Finish the remaining PRs.",
      "That was it.",
      "But even during the audit, I was already trying to reinvent the entire system again.",
      "Then something unexpected happened.",
      "Claude challenged my assumption that I had “never shipped anything.”",
      "Because technically, I had.",
      "My website was live. It existed. It worked. It wasn’t complete, but it was real. There were only about seven PRs standing between where I was and a polished deployment.",
      "That changed the perspective entirely.",
      "The issue was not that I never completed anything.",
      "The issue was that I was failing to complete the entire process.",
      "I was leaving value on the table.",
      "And even after realizing that, I still slipped back into the loop in real time.",
      "Claude literally stopped me and said:",
      "“You did it again.”",
      "That moment hit me hard.",
      "Because while receiving positive feedback about the audit and the progress I had already made, I was simultaneously trying to launch a completely new direction instead of finishing the seven tasks already sitting in front of me.",
      "That was the paradigm shift.",
      "I realized how many builders are trapped in this exact cycle.",
      "Especially in AI.",
      "People are endlessly optimizing. Endlessly researching. Endlessly rebuilding. Endlessly preparing.",
      "But never fully going to market.",
      "And suddenly, I realized something even more important:",
      "My own experience was the missing messaging on my website.",
      "Not just the frameworks. Not just the systems. Not just the terminology.",
      "The human experience behind it.",
      "The honesty.",
      "The recognition that I know what this feels like because I lived it.",
      "I think part of me was procrastinating behind intelligence. Behind frameworks. Behind concepts. Because I didn’t want to become another fake guru selling certainty I hadn’t personally pressure-tested.",
      "I wanted the work to have intrinsic value.",
      "I wanted the systems to genuinely help people.",
      "I wanted the frameworks to actually change outcomes.",
      "And ironically, it was through confronting my own loop that I finally found the clarity I had been searching for the entire time.",
      "Because the breakthrough was never just technical.",
      "It was psychological.",
      "It was understanding that tools do not replace intentionality.",
      "Frameworks do not replace execution.",
      "And intelligence does not replace completion.",
      "The missing piece was honesty.",
      "Honesty about where I was. Honesty about the loop. Honesty about the fact that even builders helping others create clarity can lose themselves in noise.",
      "And that honesty became the signal.",
      "Because now I know the messaging that connects.",
      "Not guru messaging. Not artificial certainty. Not “I have all the answers.”",
      "But:",
      "“I went through this too. I found the loop. I learned how to catch it. And this is how I started breaking it.”",
      "Sometimes the most dangerous form of procrastination is optimization.",
      "And sometimes the only way forward is to break the loop.",
    ],
  },
];

export function getLocalBlogPost(slug: string): LocalBlogPost | undefined {
  return LOCAL_BLOG_POSTS.find((post) => post.slug === slug);
}

export function localPostToStub(post: LocalBlogPost): PostStub {
  return {
    _id: post._id,
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    topicCluster: {
      _id: `local-topic-${post.topicCluster.slug}`,
      title: post.topicCluster.title,
      slug: { current: post.topicCluster.slug },
    },
    tags: [],
  };
}

export function getLocalPostStubs(): PostStub[] {
  return LOCAL_BLOG_POSTS.map(localPostToStub);
}

export function getLocalPostsByTopic(topicSlug: string): PostStub[] {
  return LOCAL_BLOG_POSTS.filter((post) => post.topicCluster.slug === topicSlug).map(localPostToStub);
}
