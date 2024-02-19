import Box from "@mui/material/Box";

const About = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
        pt: 10,
        px: 20,
      }}
    >
      <h1>Buy me a coffee ☕️</h1>

      <p>
        If you like this extension, consider buying me a coffee. Your support
        will help me to continue maintaining this extension for{" "}
        <strong>free</strong>.
      </p>
      <a
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
    </Box>
  );
};

export default About;
