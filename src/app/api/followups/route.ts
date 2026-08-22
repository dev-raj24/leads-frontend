import { NextResponse } from 'next/server';

let mockFollowups = [
  {
    id: "1",
    name: "Aman Gupta",
    when: "TOMORROW 10AM",
    reason: "Asked about braces, never replied",
    msg: "Hi Aman, happy to answer any more questions about braces — the consult is completely free 🙂",
    sent: false,
  },
  {
    id: "2",
    name: "Sneha Rao",
    when: "MON 11AM",
    reason: "Left the cleaning-slot conversation midway",
    msg: "Hi Sneha, both Monday and Tuesday are free for cleaning — which day works better for you?",
    sent: false,
  },
  {
    id: "3",
    name: "Vikram Singh",
    when: "SENT ✓",
    reason: "Asked about filling rate — follow-up sent, awaiting reply",
    msg: null,
    sent: true,
  },
];

export async function GET() {
  return NextResponse.json(mockFollowups);
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    mockFollowups = mockFollowups.map(f => 
      f.id === id 
        ? { 
            ...f, 
            sent: true, 
            when: "SENT ✓", 
            msg: null, 
            reason: f.reason.replace(" (Approved)", "") + " — follow-up sent, awaiting reply" 
          } 
        : f
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
