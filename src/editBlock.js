import React, { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import SelectMenu from "./selectMenu";
import { getCaretCoordinates, setCaretToEnd } from "./caretHelpers";

const CMD_KEY = "/";

const EditableBlock = ({
  id,
  html,
  tag,
  updatePage,
  addBlock,
  deleteBlock,
}) => {
  const [content, setContent] = useState(html);
  const [currentTag, setCurrentTag] = useState(tag);
  const [htmlBackup, setHtmlBackup] = useState(null);
  const [previousKey, setPreviousKey] = useState("");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectMenuPosition, setSelectMenuPosition] = useState({
    x: null,
    y: null,
  });

  const contentEditable = useRef(null);

  useEffect(() => {
    setContent(html);
    setCurrentTag(tag);
  }, [html, tag]);

  useEffect(() => {
    updatePage({ id, html: content, tag: currentTag });
  }, [content, currentTag]);

  const onChangeHandler = (e) => {
    setContent(e.target.value);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === CMD_KEY) {
      setHtmlBackup(content);
    }
    if (e.key === "Enter" && previousKey !== "Shift" && !selectMenuIsOpen) {
      e.preventDefault();
      addBlock({ id, ref: contentEditable.current });
    }
    if (e.key === "Enter" && selectMenuIsOpen) {
      setHtmlBackup(null);
      setSelectMenuIsOpen(false);
      setSelectMenuPosition({ x: null, y: null });
    }
    if (e.key === "Backspace" && !content) {
      e.preventDefault();
      deleteBlock({ id, ref: contentEditable.current });
    }
    setPreviousKey(e.key);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY) {
      openSelectMenuHandler();
    }
  };

  const openSelectMenuHandler = () => {
    const { x, y } = getCaretCoordinates();
    setSelectMenuIsOpen(true);
    setSelectMenuPosition({ x, y });
    document.addEventListener("mousedown", closeSelectMenuHandler);
  };

  const closeSelectMenuHandler = () => {
    console.log("closing");
    setHtmlBackup(null);
    setSelectMenuIsOpen(false);
    setSelectMenuPosition({ x: null, y: null });
    document.removeEventListener("mousedown", closeSelectMenuHandler);
  };

  const tagSelectionHandler = (newTag) => {
    setCurrentTag(newTag);
    setContent(htmlBackup);
    setCaretToEnd(contentEditable.current);
    closeSelectMenuHandler();
  };

  return (
    <>
      {selectMenuIsOpen && (
        <SelectMenu
          position={selectMenuPosition}
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={content}
        tagName={currentTag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </>
  );
};

export default EditableBlock;
