import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const About = () => {
  return (
    <div className="options-about-root">
      <Paper className="options-page-card options-about-card" elevation={0}>
        <Box className="options-page-header">
          <Box>
            <h2 className="options-page-title">Support the project</h2>
            <p className="options-page-subtitle">
              Markdown Sticky Note has been around for a while. If it saves you
              time, a coffee helps keep it maintained.
            </p>
          </Box>
        </Box>

        <div className="options-about-copy">
          <p>
            If you like this extension, consider buying me a coffee. Your
            support helps me continue maintaining it for <strong>free</strong>.
          </p>
        </div>

        <a
          className="options-support-link"
          href="https://www.buymeacoffee.com/qiwei"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            width="217"
          />
        </a>
      </Paper>
    </div>
  );
};

export default About;
