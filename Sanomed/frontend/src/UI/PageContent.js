import { useEffect } from "react";

function PageContent({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <div className="content">{children}</div>;
}

export default PageContent;
