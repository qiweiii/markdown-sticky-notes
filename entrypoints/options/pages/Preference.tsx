import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Sketch } from "@uiw/react-color";

import themes from "../../themes";
import fonts from "../../fonts";

const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const StyledRoot = styled("div")`
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .form-control {
    width: 300px;
    height: 75px;
    label {
      font-size: 0.8rem;
      animation: none;
      transform: none;
    }
    #color-label {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);
    }
    #opacity-label {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

const Preference = () => {
  const [state, setState] = useState({
    theme: "",
    font: "",
    fontsize: "",
    opacity: 1,
    color: "",
  });

  useEffect(() => {
    browser.storage.local
      .get([
        "defaultTheme",
        "defaultEditorFontFamily",
        "defaultOpacity",
        "defaultEditorFontSize",
        "defaultColor",
      ])
      .then((res) => {
        let theme = res.defaultTheme;
        let font = res.defaultEditorFontFamily;
        let fontSize = res.defaultEditorFontSize;
        let opacity = res.defaultOpacity;
        let color = res.defaultColor;
        setState({
          theme: theme,
          font: font,
          fontsize: fontSize,
          opacity: opacity,
          color,
        });
      });
  }, []);

  const updateDefaultTheme = (value: string) => {
    browser.storage.local.set({ defaultTheme: value }).then(() => {
      console.log("set default theme " + value);
    });
  };
  const updateDefaultFont = (value: string) => {
    browser.storage.local.set({ defaultEditorFontFamily: value }).then(() => {
      console.log("set default font family " + value);
    });
  };
  const updateDefaultSize = (value: string) => {
    browser.storage.local.set({ defaultEditorFontSize: value }).then(() => {
      console.log("set default font size " + value);
    });
  };
  const updateDefaultOpacity = (value: number | number[]) => {
    browser.storage.local.set({ defaultOpacity: value }).then(() => {
      console.log("set default opacity to " + value);
    });
  };
  const updateDefaultColor = (value: string) => {
    browser.storage.local.set({ defaultColor: value }).then(() => {
      console.log("set default color to " + value);
    });
  };

  const handleChangeTheme = (e: SelectChangeEvent<string>) => {
    setState((state) => ({
      ...state,
      theme: e.target.value,
    }));
    updateDefaultTheme(e.target.value);
  };

  const handleChangeFont = (e: SelectChangeEvent<string>) => {
    setState((state) => ({
      ...state,
      font: e.target.value,
    }));
    updateDefaultFont(e.target.value);
  };

  const handleChangeFontSize = (e: SelectChangeEvent<string>) => {
    setState((state) => ({
      ...state,
      fontsize: e.target.value,
    }));
    updateDefaultSize(e.target.value);
  };

  const handleChangeOpacity = (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    const opacity = Array.isArray(value) ? value[0] : value;
    setState((state) => ({
      ...state,
      opacity,
    }));
    updateDefaultOpacity(value);
  };

  const handleChangeColor = (value: string) => {
    setState((state) => ({
      ...state,
      color: value,
    }));
    updateDefaultColor(value);
  };

  return (
    <StyledRoot>
      <FormControl className="form-control">
        <InputLabel id="theme-label">Default Editor Theme</InputLabel>
        <Select
          labelId="theme-label"
          id="mutiple-theme"
          value={state.theme}
          onChange={handleChangeTheme}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {themes.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className="form-control">
        <InputLabel id="fontsize-label">Default Editor Font Size</InputLabel>
        <Select
          labelId="fontsize-label"
          id="mutiple-fontsize"
          value={state.fontsize}
          onChange={handleChangeFontSize}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {Array.from(new Array(40), (x, i) => i + 9).map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Font fam */}
      <FormControl className="form-control">
        <InputLabel id="fontfamily-label">Default Editor Font</InputLabel>
        <Select
          labelId="fontfamily-label"
          id="mutiple-fontfamily"
          value={state.font}
          onChange={handleChangeFont}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {Object.entries(fonts).map(([font, family]) => (
            <MenuItem key={font} value={family}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Opacity */}
      <FormControl className="form-control">
        <Typography id="opacity-label" gutterBottom>
          Default Note Opacity
        </Typography>
        <Slider
          id="opacity"
          aria-labelledby="opacity-label"
          value={state.opacity}
          max={1}
          min={0}
          step={0.05}
          valueLabelDisplay="auto"
          onChangeCommitted={handleChangeOpacity}
        />
      </FormControl>
      <FormControl className="form-control" sx={{ height: "400px !important" }}>
        <Typography id="color-label" gutterBottom>
          Default Background Color ({state.color})
        </Typography>
        <Box
          sx={{
            backgroundColor: state.color,
            width: 220,
            height: "20px",
            display: "inline-block",
            mb: "10px",
          }}
        />

        <Sketch
          color={state.color}
          disableAlpha
          style={{
            boxShadow:
              "rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px",
          }}
          onChange={(color) => {
            handleChangeColor(color.hex);
          }}
        />
      </FormControl>
    </StyledRoot>
  );
};

export default Preference;
