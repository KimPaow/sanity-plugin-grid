import React, { forwardRef } from "react";
import fieldsetStyles from "part:@sanity/components/fieldsets/default-style";
import styles from "./component.css";
import PropTypes from "prop-types";
import ArrayFunctions from "part:@sanity/form-builder/input/array/functions";
import { withDocument } from "part:@sanity/form-builder";
import RenderItemValue from "./components/itemValue";
// import RenderItemValue from "@sanity/form-builder/lib/inputs/ArrayInput/ItemValue";
import { startsWith } from "@sanity/util/paths";
import PatchEvent, {
  insert,
  set,
  setIfMissing,
  unset
} from "part:@sanity/form-builder/patch-event";
import { createProtoValue, resolveTypeName, randomKey } from "./utils";

const SanityGrid = forwardRef((props, ref) => {
  const { level, value, type } = props;
  const NO_MARKERS = [];

  console.debug("[SanityGrid] props: ", props);

  const renderGrid = () => {
    const {
      type,
      markers,
      readOnly,
      value,
      focusPath = [],
      onBlur,
      onFocus,
      level,
      filterField,
      document
    } = props;

    if (value === "undefined") return <p>No grid items created yet</p>;

    const getMemberTypeOfItem = item => {
      const { type } = props;
      const itemTypeName = resolveTypeName(item);
      const memberType = type.of.find(
        memberType => memberType.name === itemTypeName
      );
      return memberType;
    };

    const handleItemChange = (event, item) => {
      const { onChange, value } = props;
      const memberType = getMemberTypeOfItem(item);
      if (!memberType) {
        // eslint-disable-next-line no-console
        console.debug(
          `[renderGrid ] handleItemChange(): Could not find member type of ${item ||
            "item"}`,
          item
        );
        return;
      }
      if (memberType.readOnly) {
        return;
      }
      const key = item._key || randomKey(12);
      onChange(
        event
          .prefixAll({ _key: key })
          .prepend(item._key ? [] : set(key, [value.indexOf(item), "_key"]))
      );
    };

    const removeItem = item => {
      const { onChange, value } = props;
      onChange(
        PatchEvent.from(
          unset(item._key ? [{ _key: item._key }] : [value.indexOf(item)])
        )
      );
    };

    const handleRemoveItem = item => {
      removeItem(item);
      // const { onChange, value } = this.props;
      // const e = PatchEvent.from(
      //   unset(item._key ? [{ _key: item._key }] : [value.indexOf(item)])
      // );
      // console.debug("[removeItem]", e);
      // onChange(e);
    };

    // add sortable: false to options to remove itemValue's draghandle
    type.options = type.options
      ? Object.assign(type.options, { sortable: false })
      : { sortable: false };

    const gridStyles = {
      gridTemplateColumns: "repeat(12, 1fr)"
    };

    const { gridsettings } = document.grid || {};
    const { columns, rows } = gridsettings || {};

    if (columns) gridStyles.gridTemplateColumns = columns;
    if (rows) gridStyles.gridTemplateRows = rows;

    return (
      <ul className={styles.grid_field} style={gridStyles}>
        {value &&
          value.map(item => {
            const isChildMarker = marker =>
              startsWith([index], marker.path) ||
              startsWith([{ _key: item && item._key }], marker.path);
            const childMarkers = markers.filter(isChildMarker);

            return (
              <li
                className={styles.grid_item}
                key={item._key}
                style={{ gridColumn: item.columns, gridRow: item.rows }}
              >
                <RenderItemValue
                  type={type}
                  value={item}
                  level={level}
                  markers={
                    childMarkers.length === 0 ? NO_MARKERS : childMarkers
                  }
                  onRemove={handleRemoveItem}
                  onChange={handleItemChange}
                  focusPath={focusPath}
                  filterField={filterField}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  readOnly={readOnly}
                />
              </li>
            );
          })}
      </ul>
    );
  };

  const append = (itemValue, position, atIndex) => {
    const { onChange } = props;
    const e = PatchEvent.from(
      setIfMissing([]),
      insert([itemValue], position, [atIndex])
    );
    console.debug("[append]", e);
    onChange(e);
  };

  const handleAppend = (value, valuePatchEvent) => {
    console.debug("[SanityGrid] handle append - value: ", value);
    console.debug(
      "[SanityGrid] handle append - valuePatchEvent: ",
      valuePatchEvent
    );
    append(value, "after", -1);
  };

  // props.onChange(
  //   PatchEvent.from(unset(value._key ? [{ _key: value._key }] : null))
  // );

  return (
    <div ref={ref} key="SANITY_GRID_INPUT">
      {value && (
        <div className={`${styles.grid_field} ${fieldsetStyles.content}`}>
          {renderGrid()}
        </div>
      )}
      <ArrayFunctions
        type={type}
        value={value}
        // readOnly={readOnly}
        onAppendItem={handleAppend}
        // onPrependItem={this.handlePrepend}
        // onFocusItem={this.handleFocusItem}
        onCreateValue={createProtoValue}
        // onChange={onChange}
      />
    </div>
  );
});

// SanityGrid.PropTypes = {
//   type: PropTypes.shape({
//     fields: PropTypes.array.isRequired
//   }).isRequired,
//   value: PropTypes.object,
//   onFocus: PropTypes.func,
//   onBlur: PropTypes.func,
//   onChange: PropTypes.func.isRequired
// };

export default withDocument(SanityGrid);
