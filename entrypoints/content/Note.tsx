import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import PinDropIcon from '@mui/icons-material/PinDrop';
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { ViewUpdate } from "@uiw/react-codemirror";
import { Compact } from "@uiw/react-color";
import { useCallback, useLayoutEffect, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { Resizable, ResizeCallback } from "re-resizable";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { useOutsideClickRef } from "rooks";

// result's code block theme
import nightOwl from "react-syntax-highlighter/dist/cjs/styles/prism/night-owl";

import Editor from "./Editor";
import themes from "../themes";
import fonts from "../fonts";
import type { Note } from "./storage";
import { Typography } from "@mui/material";

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

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  id: number;
  deleteNoteFn: (id: number) => void;
  updateNoteFn: (updatedData: Note, id: number) => void;
  defaultTheme: string;
  editorFontSize: number;
  editorFontFamily: string;
  content: string;
  opacity: number;
  optionsPage: string;
  autofocus: boolean;
  color: string | undefined;
};

const Note = (props: Props) => {
  const [setting, setSetting] = useState({
    noteDim: {
      x: props.width,
      y: props.height, // width and height from resizable
    },
    position: {
      x: props.x,
      y: props.y, // x,y position for draggable
    },
    id: props.id,
    openSetting: false,
    anchorEl: null,
    anchorElHelp: null,
    dragging: false,
    theme: props.defaultTheme,
    editorFontSize: props.editorFontSize,
    editorFontFamily: props.editorFontFamily,
    mode: props.content?.trim() ? 1 : 0, // 0 for editing, 1 for display
    markdownSrc: props.content,
    opacity: props.opacity,
    pinColor: "action",
    color: props.color,
  });

  const handleClickOutside = () => {
    setSetting({ ...setting, mode: 1 });
  };

  const [ref] = useOutsideClickRef(handleClickOutside);

  const handleClickInside: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setSetting({ ...setting, mode: 0 });
  };

  const handleMarkdownChange = (value: string, viewUpdate: ViewUpdate) => {
    setSetting((setting) => ({ ...setting, markdownSrc: value }));
  };

  const handleDelete = () => {
    props.deleteNoteFn(setting.id);
  };

  const handleSettingClose = () => {
    setSetting({
      ...setting,
      anchorEl: null,
    });
  };

  const handleSettingClick = (e: any) => {
    setSetting({
      ...setting,
      anchorEl: e.currentTarget,
    });
  };

  const handleHelpClose = () => {
    setSetting({
      ...setting,
      anchorElHelp: null,
    });
  };

  const handleHelpClick = (e: any) => {
    setSetting({
      ...setting,
      anchorElHelp: e.currentTarget,
    });
  };

  const handleStart = (e: any) => {
    // draggable
    if (e.target.id === "settingButton" || e.target.id === "helpButton") return;
    setSetting((setting) => ({
      ...setting,
      dragging: true,
    }));
  };

  const handleStop: DraggableEventHandler = (event, data) => {
    // draggable
    setSetting((setting) => ({
      ...setting,
      dragging: false,
      position: {
        x: data.x,
        y: data.y,
      },
    }));
  };

  // Handle mouse down for updating zIndex of the focused note.
  // The following functions get DOM elem coz Draggable component does not accept style property
  const handleMouseDown = useCallback(() => {
    let curMaxZIndex = window.localStorage.getItem("md-curMaxIndex");
    let el = document.getElementsByClassName(
      "markdown-react-draggable" + setting.id
    )[0];
    // @ts-ignore
    if (el) el.style.zIndex = curMaxZIndex++;
    window.localStorage.setItem("md-curMaxIndex", curMaxZIndex || "1300");
  }, [setting.id]);

  // hack for firefox that cannot update dragging state (a react-draggable bug)
  const onHandleMouseUp = () => {
    setSetting({
      ...setting,
      dragging: false,
    });
  };

  // setPositionCSSProperty = () => {
  //   let el = document.getElementsByClassName('markdown-react-draggable'+setting.id)[0];
  //   if (el) {
  //     el.style.position = el.style.position === "relative" ? "fixed" : "relative";
  //     setting.pinColor === "action" ? setState({ pinColor: "primary" }) : setState({ pinColor: "action" });;
  //   }
  // }

  const onResizeStop: ResizeCallback = (event, direction, ref, delta) => {
    setSetting((setting) => ({
      ...setting,
      noteDim: {
        x: setting.noteDim.x + delta.width,
        y: setting.noteDim.y + delta.height,
      },
    }));
  };

  const handleChangeTheme = (e: SelectChangeEvent<string>) => {
    setSetting((setting) => ({
      ...setting,
      theme: e.target.value,
      mode: 0,
    }));
  };

  const handleChangeFont = (e: SelectChangeEvent<string>) => {
    setSetting((setting) => ({
      ...setting,
      editorFontFamily: e.target.value,
      mode: 0,
    }));
  };

  const handleChangeFontSize = (e: SelectChangeEvent<string>) => {
    setSetting((setting) => ({
      ...setting,
      editorFontSize: Number(e.target.value) || 16,
      mode: 0,
    }));
  };

  const updateStorage = () => {
    let updatedData = {
      id: setting.id,
      x: setting.position.x,
      y: setting.position.y,
      width: setting.noteDim.x,
      height: setting.noteDim.y,
      content: setting.markdownSrc,
      theme: setting.theme,
      font: setting.editorFontFamily,
      fontSize: setting.editorFontSize,
      opacity: setting.opacity,
      color: setting.color,
    };
    props.updateNoteFn(updatedData, setting.id);
  };

  // see: https://kentcdodds.com/blog/useeffect-vs-uselayouteffect
  // This runs synchronously immediately
  // after React has performed all DOM mutations.
  // This can be useful if you need to make DOM measurements
  // (like getting the scroll position or other styles for an element)
  // and then make DOM mutations or trigger
  // a synchronous re-render by updating state.
  //
  // Anyway, if I use useEffect here,
  // the position will be the old one, not the new position
  useLayoutEffect(() => {
    updateStorage();
  }, [
    setting.position,
    setting.dragging,
    setting.noteDim,
    setting.theme,
    setting.editorFontSize,
    setting.editorFontFamily,
    setting.markdownSrc,
    setting.color,
  ]);

  return (
    <div className="note-root">
      <Draggable
        handle=".handle"
        onStart={handleStart}
        onStop={handleStop}
        onMouseDown={handleMouseDown}
        defaultClassName={"markdown-react-draggable" + props.id}
        defaultPosition={{
          x: setting.position.x,
          y: setting.position.y,
        }}
        // defaultPosition={{x:window.innerWidth*0.3, y:window.innerHeight*0.5}}
        // bounds="body"
        // bounds="parent"
      >
        <Resizable
          defaultSize={{
            width: setting.noteDim.x,
            height: setting.noteDim.y,
          }}
          minWidth={100}
          minHeight={100}
          onResizeStop={onResizeStop}
        >
          <div
            className="markdown-sticky-note-paper"
            style={{
              opacity: `${setting.opacity}`,
              backgroundColor: `${setting.color || "#fff"}`,
            }}
          >
            {/* Note tool bar */}
            <div className="handle" onMouseUp={onHandleMouseUp}>
              <button
                className="markdown-sticky-note-button"
                onClick={handleDelete}
              >
                <CloseIcon fontSize="small" />
              </button>
              <button
                className="markdown-sticky-note-button"
                aria-describedby={
                  Boolean(setting.anchorEl) ? "setting-popover" : undefined
                }
                onClick={handleSettingClick}
              >
                <SettingsIcon id="settingButton" fontSize="small" />
              </button>
              <Popover
                className="markdown-popover"
                id="setting-popover"
                disableScrollLock={true}
                open={Boolean(setting.anchorEl)}
                anchorEl={setting.anchorEl}
                onClose={handleSettingClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack>
                  <Stack flexDirection="row">
                    <FormControl
                      style={{ zIndex: 1, margin: 5, width: 100 }}
                      className="markdown-setting-popover"
                    >
                      <InputLabel id="theme-label">Editor Theme</InputLabel>
                      <Select
                        labelId="theme-label"
                        id="mutiple-theme"
                        value={setting.theme}
                        onChange={handleChangeTheme}
                        input={<Input />}
                        MenuProps={MenuProps}
                      >
                        {themes.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            className="markdown-setting-select"
                          >
                            {name[0].toUpperCase() + name.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ zIndex: 1, margin: 5, width: 105 }}
                      className="markdown-setting-popover"
                    >
                      <InputLabel id="fontsize-label">
                        Editor Font Size
                      </InputLabel>
                      <Select
                        labelId="fontsize-label"
                        id="mutiple-fontsize"
                        value={`${setting.editorFontSize}`}
                        onChange={handleChangeFontSize}
                        input={<Input />}
                        MenuProps={MenuProps}
                      >
                        {Array.from(new Array(40), (x, i) => i + 9).map(
                          (size) => (
                            <MenuItem
                              key={size}
                              value={`${size}`}
                              className="markdown-setting-select"
                            >
                              {size}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ zIndex: 1, margin: 5, width: 100 }}
                      className="markdown-setting-popover"
                    >
                      <InputLabel id="fontfamily-label">Editor Font</InputLabel>
                      <Select
                        labelId="fontfamily-label"
                        id="mutiple-fontfamily"
                        value={setting.editorFontFamily}
                        onChange={handleChangeFont}
                        input={<Input />}
                        MenuProps={MenuProps}
                      >
                        {Object.entries(fonts).map(([font, family]) => (
                          <MenuItem
                            key={font}
                            value={family}
                            className="markdown-setting-select"
                          >
                            {font}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <Box
                    style={{ zIndex: 1, margin: 5, width: 100 }}
                    className="markdown-setting-popover"
                  >
                    <Typography color="rgba(0, 0, 0, 0.6)" fontSize={12}>
                      Note Color
                    </Typography>
                    <Compact
                      color={setting.color}
                      style={{
                        boxShadow:
                          "rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px",
                      }}
                      onChange={(color) => {
                        setSetting((setting) => ({
                          ...setting,
                          color: color.hex,
                          mode: 1,
                        }));
                      }}
                    />
                  </Box>
                </Stack>
              </Popover>
              <button
                className="markdown-sticky-note-button"
                aria-describedby={
                  Boolean(setting.anchorElHelp) ? "help-popover" : undefined
                }
                onClick={handleHelpClick}
              >
                <HelpOutlineIcon id="helpButton" fontSize="small" />
              </button>
              <Popover
                id="help-popover"
                open={Boolean(setting.anchorElHelp)}
                anchorEl={setting.anchorElHelp}
                onClose={handleHelpClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                disableScrollLock={true}
              >
                <div id="markdown-help-popover">
                  <MenuItem
                    key={2}
                    component="a"
                    target="_blank"
                    onClick={() => {
                      browser.runtime.openOptionsPage();
                    }}
                  >
                    Settings <OpenInNewIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                  <MenuItem
                    key={1}
                    component="a"
                    href="https://guides.github.com/features/mastering-markdown/"
                    target="_blank"
                  >
                    How to use Markdown?{" "}
                    <OpenInNewIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                  <MenuItem
                    key={2}
                    component="a"
                    href="https://discord.gg/X5EK8m2ksN"
                    target="_blank"
                  >
                    Discord <OpenInNewIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                  <MenuItem
                    key={2}
                    component="a"
                    href="https://x.com/qiweidyang"
                    target="_blank"
                  >
                    X <OpenInNewIcon fontSize="small" sx={{ ml: 1 }} />
                  </MenuItem>
                </div>
              </Popover>
              {/* <button className="markdown-sticky-note-button" onClick={setPositionCSSProperty} size="small">
                  <PinDropIcon color={setting.pinColor} fontSize="small"/>
                </button> */}
            </div>

            {/* Note editor & display area */}
            <div ref={ref} className="note-pane">
              {setting.dragging ? (
                <div>
                  {Array.from(
                    new Array(Math.floor((0.8 * (setting.noteDim.y - 44)) / 26))
                  ).map((v, i) => (
                    <Skeleton key={i} height={20} style={{ margin: 6 }} />
                  ))}
                  <Skeleton height={20} style={{ margin: 6 }} width="80%" />
                </div>
              ) : setting.mode === 0 ? (
                <Editor
                  value={setting.markdownSrc}
                  theme={setting.theme}
                  fontSize={setting.editorFontSize}
                  fontFamily={setting.editorFontFamily}
                  onChange={handleMarkdownChange}
                  autofocus={props.autofocus}
                />
              ) : (
                <div onClick={handleClickInside} className="result-container">
                  <ReactMarkdown
                    // rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="result"
                    skipHtml={false}
                    urlTransform={(url) => url}
                    // https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noreferrer" />
                      ),
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          // https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/prism.html
                          <SyntaxHighlighter
                            // @ts-ignore
                            style={nightOwl}
                            language={match[1]}
                            PreTag="div"
                            useInlineStyles
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {setting.markdownSrc}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </Resizable>
      </Draggable>
    </div>
  );
};

export default Note;
