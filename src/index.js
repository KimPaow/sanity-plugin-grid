import React from "react";
import styles from "./component.css";
import PropTypes from "prop-types";
import FormField from "part:@sanity/components/formfields/default";
import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";

const createPatchFrom = value =>
  PatchEvent.from(value === "" ? unset() : set(value));

class SanityGrid extends React.Component {
  render() {
    const { level, value, type } = this.props;
    console.log(props);

    return (
      <FormField
        label={type.title ? type.title : ""}
        description={type.description ? type.description : null}
        level={level}
      >
        <div className={styles.container}>
          {/* {this.createColors(colors, value, type.options ? type.options : {})} */}
          TESTING THE GRID WOHOO
        </div>
      </FormField>
    );
  }
}

export default SanityGrid;
