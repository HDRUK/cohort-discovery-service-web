import { getYouTubeEmbedUrl } from "@/utils/youtube";
import { IFrameWrapper } from "./IFrameWrapper";

type VideoProps = {
  url: string;
  title?: string;
  maxWidth?: string;
};

// Renders a YouTube video from any link form (youtu.be, watch?v=, embed, …).
// Used both inline in help .mdx content and by the tutorial detail view.
const Video = ({ url, title = "Tutorial video", maxWidth }: VideoProps) => {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <IFrameWrapper maxWidth={maxWidth}>
      <iframe
        loading="lazy"
        title={title}
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: "0", borderRadius: "10px" }}
      ></iframe>
    </IFrameWrapper>
  );
};

export default Video;
