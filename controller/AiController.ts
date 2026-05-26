import type { NextFunction, Request, Response } from "express";
import OpenAI from "openai";

const invokeUrl ="https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b";
const openai  = new OpenAI({
     apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
}) 


export const genrateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const payload = {
     "prompt": prompt,
 "width": 1024,
  "height": 1024,
  "seed": 0,
  "steps": 4
    };

    const response = await fetch(invokeUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
         "Authorization":  `Bearer ${process.env.NVIDIA_IMAGE_KEY}`,
"Accept": "application/json",
          "Content-Type": "application/json",
      },
    });



    if (!response.ok) {
      const errBody = await response.text();

      return res.status(response.status).json({
        success: false,
        message: errBody,
      });
    }

    const responseBody = await response.json();

    return res.status(200).json({
      success: true,
      data: responseBody,
    });
  } catch (error) {
    next(error);
  }
};

export const genrateQNS=async(  req: Request,res: Response, next: NextFunction)=>{
try {
    const {contant} = req.body

     if (!contant) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

      const completion = await openai.chat.completions.create({
    model: "google/gemma-2-2b-it",
    messages: [{"content":contant,"role":"user"}],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream: true,
  })
   res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );
      res.setHeader(
      "Transfer-Encoding",
      "chunked"
    );

       for await (const chunk of completion) {
      const text =
        chunk.choices[0]?.delta?.content || "";

      res.write(text);
    }

    res.end();
   
} catch (error) {
    next(error);
}
}