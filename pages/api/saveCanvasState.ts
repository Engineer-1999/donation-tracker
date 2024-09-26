import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { canvasState } = req.body;
    // Save canvasState to your database
    // Example: await db.collection('canvasStates').insertOne({ canvasState });

    res.status(200).json({ message: 'Canvas state saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
