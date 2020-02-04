import React, { Fragment } from "react";
import styles from "./component.css";
import PropTypes from "prop-types";
import FormField from "part:@sanity/components/formfields/default";
import { patches } from "part:@sanity/form-builder";

// const createPatchFrom = value =>
//   PatchEvent.from(value === "" ? unset() : set(value));

const SanityGrid = props => {
  const { level, value, type } = props;
  console.debug("props: ", props);

  return (
    // <Fragment key={"sanity_grid_id"}>
    //   <FormBuilderInput
    //     {...props}
    //     onChange={patchEvent => {
    //       props.onChange(patchEvent);
    //     }}
    //   />
    // </Fragment>
    <FormField
      label={type.title ? type.title : ""}
      description={type.description ? type.description : null}
      level={level}
    >
      <div className={styles.gridcontainer}>
        {/* {this.createColors(colors, value, type.options ? type.options : {})} */}
        TESTING THE GRID WOHOO
      </div>
    </FormField>
  );
};

// SanityGrid.PropTypes = {
//   type: PropTypes.shape({
//     fields: PropTypes.array.isRequired
//   }).isRequired,
//   value: PropTypes.object,
//   onFocus: PropTypes.func,
//   onBlur: PropTypes.func,
//   onChange: PropTypes.func.isRequired
// };

export default SanityGrid;
