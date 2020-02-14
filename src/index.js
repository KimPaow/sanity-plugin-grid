import React, { forwardRef, useEffect, useRef } from "react";
import fieldsetStyles from "part:@sanity/components/fieldsets/default-style";
import styles from "./component.css";
import PropTypes from "prop-types";
import ArrayFunctions from "part:@sanity/form-builder/input/array/functions";
import { withDocument } from "part:@sanity/form-builder";
import RenderItemValue from "./components/itemValue";
import { startsWith } from "@sanity/util/paths";
import PatchEvent, {
  insert,
  set,
  setIfMissing,
  unset
} from "part:@sanity/form-builder/patch-event";
import { createProtoValue, randomKey, getMemberType } from "./utils";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import useEventListener from "./utils/hooks/useEventListener";

gsap.registerPlugin(Draggable);

const SanityGrid = forwardRef((props, ref) => {
  const { level, value, type, document } = props;
  const NO_MARKERS = [];
  const gridRef = useRef(null);
  const draggableRef = useRef(null);
  const colFallback = 6,
    rowFallback = 4;

  const { rows = rowFallback, columns = colFallback } =
    document.sanitygrid || {};
  console.debug("[ Grid ] - props: ", props);

  let gridDetails = {
    rowHeight: 0,
    columnWidth: 0,
    gap: 5
  };

  const handleDragEnd = e => {
    const closestElement = e.target?.closest(`.${styles.grid_item}`);

    if (!closestElement) {
      console.error("Sanity Grid Input could not find the dragged element.");
      console.debug(
        `[Sanity Grid] Handle Drag End - e.target: ${e.target}`,
        e.target
      );
      return;
    }

    const { rowHeight, columnWidth } = gridDetails;
    const itemKey = closestElement.dataset.key;
    const item = value.find(element => {
      return element._key === itemKey;
    });

    const gridBounding = gridRef.current.getBoundingClientRect();
    const elementBounding = closestElement.getBoundingClientRect();
    const diffs = {
      x: Math.round(elementBounding.left - gridBounding.left),
      y: Math.round(elementBounding.top - gridBounding.top)
    };
    const pos = {
      col: Math.round(diffs.x / columnWidth) + 1,
      row: Math.round(diffs.y / rowHeight) + 1
    };

    let newItem = { ...item } || {};
    !newItem.settings ? (newItem.settings = {}) : null;
    newItem.settings.posX = pos.col;
    newItem.settings.posY = pos.row;

    const patch = PatchEvent.from(set(newItem));

    closestElement.style.transform = null;

    item && item && handleItemChange(patch, item);

    gsap.set(closestElement, {
      transform: null,
      gridColumnStart: pos.col,
      gridRowStart: pos.row
    });
  };

  const createDraggable = () => {
    const snap = (value, snapTo) => {
      return Math.round(value / snapTo) * snapTo;
    };

    draggableRef.current = Draggable.create(`.${styles.grid_item}`, {
      bounds: gridRef.current,
      throwProps: true,
      type: "x,y",
      liveSnap: {
        x: value => {
          return snap(value, gridDetails.columnWidth);
        },
        y: value => {
          return snap(value, gridDetails.rowHeight);
        }
      },
      onDragEnd: handleDragEnd
    });
  };

  const updateGridDetails = () => {
    let grid = gridRef.current;

    if (!grid) {
      return;
    }

    // dimensions with the grid gap included
    gridDetails.rowHeight = grid.offsetHeight / rows;
    gridDetails.columnWidth = grid.offsetWidth / columns;
  };

  const handleResize = () => {
    updateGridDetails();
  };

  useEventListener("resize", handleResize);

  useEffect(() => {
    updateGridDetails();
    createDraggable();
  });

  const handleItemChange = (event, item) => {
    const { onChange, value, type } = props;
    const memberType = getMemberType(item, type);

    if (!memberType) {
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

  const append = (itemValue, position, atIndex) => {
    const { onChange } = props;
    const e = PatchEvent.from(
      setIfMissing([]),
      insert([itemValue], position, [atIndex])
    );
    onChange(e);
  };

  const handleAppend = value => {
    append(value, "after", -1);
  };

  const renderGrid = () => {
    const {
      type,
      markers,
      value,
      focusPath = [],
      onBlur,
      onFocus,
      level,
      filterField
    } = props;

    if (value === "undefined") return <p>No grid items created yet</p>;

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
    };

    const gridStyles = {};
    gridStyles.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gridStyles.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const renderShadowGrid = (columns, rows) => {
      let items = [];

      for (let i = 0; i < columns * (rows || 1); i++) {
        items.push(<span key={i}></span>);
      }
      return items;
    };

    return (
      <>
        <ul ref={gridRef} className={styles.grid_field} style={gridStyles}>
          {value
            ? value.map((item, i) => {
                const isChildMarker = marker =>
                  startsWith([index], marker.path) ||
                  startsWith([{ _key: item && item._key }], marker.path);

                const childMarkers = markers?.filter(isChildMarker);

                const { width, height, posX, posY } = item.settings || {};

                return (
                  <li
                    className={styles.grid_item}
                    key={item._key || i}
                    style={{
                      gridColumnStart: posX || "auto",
                      gridColumnEnd: width ? `span ${width}` : "auto",
                      gridRowStart: posY || "auto",
                      gridRowEnd: height ? `span ${height}` : "auto"
                    }}
                  >
                    <RenderItemValue
                      type={type}
                      value={item}
                      level={level}
                      markers={
                        childMarkers?.length === 0 ? NO_MARKERS : childMarkers
                      }
                      onRemove={handleRemoveItem}
                      onChange={handleItemChange}
                      focusPath={focusPath}
                      filterField={filterField}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      readOnly={props.readOnly}
                    />
                  </li>
                );
              })
            : null}
          <div className={`${styles.grid_field_shadow}`} style={gridStyles}>
            {renderShadowGrid(columns || 6, rows || 1)}
          </div>
        </ul>
      </>
    );
  };

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
        readOnly={props.readOnly}
        onAppendItem={handleAppend}
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

export let basic = {
  settings: [
    {
      title: "Columns",
      name: "columns",
      fieldset: "settings",
      type: "number"
    },
    {
      title: "Rows",
      name: "rows",
      fieldset: "settings",
      type: "number"
    }
  ],
  item: [
    {
      title: "Width",
      description: "Width in number of columns.",
      name: "width",
      type: "number"
    },
    {
      title: "Height",
      description: "Height in number of rows.",
      name: "height",
      type: "number"
    },
    {
      title: "Column",
      description: "What column to position the item at.",
      name: "posX",
      type: "number"
    },
    {
      title: "Row",
      description: "What row to position the item at.",
      name: "posY",
      type: "number"
    }
  ]
};
export default withDocument(SanityGrid);
