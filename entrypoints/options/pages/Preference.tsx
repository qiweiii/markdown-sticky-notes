import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import { Sketch } from "@uiw/react-color";

import themes from "../../themes";
import fonts from "../../fonts";
import type { StorageDefaults } from "../../content/storage";

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

type PreferenceState = {
  theme: string;
  font: string;
  fontsize: number;
  opacity: number;
  color: string;
};

type PreferenceStorageDefaults = Pick<
  StorageDefaults,
  | "defaultTheme"
  | "defaultEditorFontFamily"
  | "defaultOpacity"
  | "defaultEditorFontSize"
  | "defaultColor"
>;

const Preference = () => {
  const [state, setState] = useState<PreferenceState>({
    theme: "monokai",
    font: '"Consolas", "monaco", monospace',
    fontsize: 14,
    opacity: 0.9,
    color: "#fff",
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
        const defaults = res as Partial<PreferenceStorageDefaults>;
        setState({
          theme: defaults.defaultTheme ?? "monokai",
          font:
            defaults.defaultEditorFontFamily ??
            '"Consolas", "monaco", monospace',
          fontsize: defaults.defaultEditorFontSize ?? 14,
          opacity: defaults.defaultOpacity ?? 0.9,
          color: defaults.defaultColor ?? "#fff",
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
  const updateDefaultSize = (value: number) => {
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

  const handleChangeFontSize = (e: SelectChangeEvent<number>) => {
    const fontsize = Number(e.target.value);
    setState((state) => ({
      ...state,
      fontsize,
    }));
    updateDefaultSize(fontsize);
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
    <div className="options-preference-root">
      <Paper className="options-page-card" elevation={0}>
        <Box className="options-page-header">
          <Box>
            <h2 className="options-page-title">Preferences</h2>
            <p className="options-page-subtitle">
              Tune the default note style once and keep every new sticky note
              consistent.
            </p>
          </Box>
        </Box>

        <div className="options-settings-grid">
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
            <Select<number>
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
          <FormControl className="form-control form-control-wide">
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
          <FormControl className="form-control form-control-wide">
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
        </div>

        <FormControl className="form-control form-control-color">
          <Typography id="color-label" gutterBottom>
            Default Background Color ({state.color})
          </Typography>
          <Box className="options-color-preview" sx={{ backgroundColor: state.color }} />

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
      </Paper>
    </div>
  );
};

export default Preference;
