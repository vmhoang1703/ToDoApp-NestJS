import { FC, useState } from "react";

interface LongDescriptionProps {
  content: string;
  limit?: number;
}

const LongDescription: FC<LongDescriptionProps> = ({ content, limit = 10 }) => {
  if (content.length <= limit) {
    return <>{content}</>;
  } else {
    const toShow = content.substring(0, limit) + "...";
    return <>{toShow}</>;
  }
};

export default LongDescription;
