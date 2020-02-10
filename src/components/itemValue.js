import React, { useState } from "react";
import DefaultDialog from "part:@sanity/components/dialogs/default";
import DialogContent from "part:@sanity/components/dialogs/content";
import { FormBuilderInput } from "part:@sanity/form-builder";
import Preview from "@sanity/form-builder/lib/Preview";
import DefaultPreview from "part:@sanity/components/previews/default";
import { resolveTypeName } from "../utils";
import styles from "./itemValue.css";

const CLOSE_ACTION = {
  name: "close",
  title: "Close"
};
const CANCEL_ACTION = {
  name: "close",
  title: "Cancel"
};
const DELETE_ACTION = {
  name: "delete",
  title: "Delete",
  color: "danger",
  inverted: true,
  secondary: true
};

const RenderItemValue = props => {
  const { value, markers, type, readOnly } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditStart = () => {
    setIsExpanded(true);
  };

  const handleEditStop = () => {
    setIsExpanded(false);
  };

  const handleRemove = () => {
    const { onRemove, value } = props;
    onRemove(value);
  };

  const handleDialogAction = action => {
    if (action.name === "close") {
      handleEditStop();
    }
    if (action.name === "delete") {
      // Needs a proper confirm dialog later
      if (window.confirm("Do you really want to delete?")) {
        handleRemove();
      }
    }
  };

  const getMemberType = () => {
    const { value, type } = props;
    const itemTypeName = resolveTypeName(value);
    return type.of.find(memberType => memberType.name === itemTypeName);
  };

  // The types object
  const memberType = getMemberType();

  // For editing in the griditem obj in a popup
  const renderEditItemForm = item => {
    const {
      markers,
      focusPath,
      onFocus,
      onBlur,
      readOnly,
      filterField
    } = props;

    const IGNORE_KEYS = ["_key", "_type", "_weak"];

    function isEmpty(value) {
      return Object.keys(value).every(key => IGNORE_KEYS.includes(key));
    }

    const handleChange = event => {
      const { onChange, value } = props;
      onChange(event, value);
    };

    const childMarkers = markers?.filter(marker => marker.path.length > 1);

    const content = (
      <FormBuilderInput
        type={memberType}
        level={0}
        value={isEmpty(item) ? undefined : item}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        focusPath={focusPath}
        readOnly={readOnly || memberType.readOnly}
        markers={childMarkers}
        path={[{ _key: item._key }]}
        filterField={filterField}
      />
    );

    // return content
    const isItemEmpty = isEmpty(item);
    const actions = [
      isItemEmpty ? CANCEL_ACTION : CLOSE_ACTION,
      !isItemEmpty && !readOnly && DELETE_ACTION
    ].filter(Boolean);

    return (
      <DefaultDialog
        onClose={handleEditStop}
        key={item._key}
        title={`Edit ${memberType.title}`}
        actions={actions}
        onAction={handleDialogAction}
        showCloseButton={false}
      >
        <div>
          <DialogContent size="medium">{content}</DialogContent>
        </div>
      </DefaultDialog>
    );
  };

  const buildPreview = (value, prepare, select) => {
    let selectEntries = Object.entries(select);
    let preview = {};

    for (let i = 0; i < selectEntries.length; i++) {
      const current = selectEntries[i];
      preview[current[0]] = value[current[1]];
    }

    if (prepare) return prepare(preview);

    return preview;
  };

  const renderItem = () => {
    const { prepare, select } = memberType.preview;
    const previewValues = buildPreview(value, prepare, select);

    console.log("previewValues", previewValues);

    return (
      <div
        className={styles.value_container}
        tabIndex={0}
        onClick={value._key && handleEditStart}
      >
        {/* <Preview layout={"default"} value={value} type={memberType} /> */}
        <DefaultPreview {...previewValues} media={false} />
      </div>
    );
  };

  return (
    <>
      {renderItem()}
      {isExpanded && renderEditItemForm(value)}
    </>
  );
};

export default RenderItemValue;
