import React, { useState } from "react";
import { FIELDS } from "../../../config/form-types";
import { createUseFieldState } from "../../../redux/selectors";
import ErrorMessage from "../../../components/ErrorMessage";
import TextArea from "../../../components/Form/TextArea";
import ImageField, {
  IMAGEFIELD_ERROR_TYPES,
} from "../../../components/Form/ImageField";
import { StepPropTypes } from "../../../types/types";
import styles from "./step-three.module.css";

const ImageErrorMap: Record<string, string> = {
  [IMAGEFIELD_ERROR_TYPES.FILESIZE]:
    "The provided image is too big, please select a smaller image.",
  [IMAGEFIELD_ERROR_TYPES.MIME]:
    "The provided image has an invalid file format. Please provide a PNG or JPEG image.",
  [IMAGEFIELD_ERROR_TYPES.UNKNOWN]:
    "An error occured while processing your image. Please try a different image.",
};

export const StepThree: React.FC<StepPropTypes> = ({
  id = "step-one",
  isError = false,
  errorMessage = "Oh no an error has occured trying to submit your review.",
}) => {
  const [imageError, setImageError] = useState("");
  const useFieldState = createUseFieldState(id);
  const [image, setImage] = useFieldState({
    fieldKey: FIELDS.IMAGE,
  });
  const [imageDescription, setImageDescription] = useFieldState({
    fieldKey: FIELDS.IMAGE_DESCRIPTION,
  });

  return (
    <section data-test-id='step-three'>
      <ErrorMessage
        isVisible={!!imageError || isError}
        messages={[errorMessage, imageError]}
      />
      <div className={styles.wrapper}>
        <div className={styles.imagefield}>
          <ImageField
            label='Select an image'
            onError={(error) => setImageError(ImageErrorMap[error] || "")}
            value={image}
            onChange={(image) => {
              setImageError("");
              setImage(image);
            }}
          />
        </div>
        <TextArea
          label='Please provide a description (optional)'
          onTextChange={setImageDescription}
          value={imageDescription}
        />
      </div>
    </section>
  );
};
export default StepThree;
