import React from "react";
import { Button } from "../../Button";
import styles from "./imagefield.module.css";

/**
 *
 * @description A set of error types that can occur
 */
export enum IMAGEFIELD_ERROR_TYPES {
  FILESIZE = "filesize",
  MIME = "mime",
  UNKNOWN = "unknown",
}

type MimeIdentifierType = {
  mime: string;
  pattern: number[];
  mask: number[];
};
/**
 *
 * @description Parse the header of a file and match it with known mimetypes, if there is a match return the mimetype.
 */
const getMimeType = (file: File) =>
  new Promise((resolve, reject) => {
    const mimes = [
      {
        mime: "image/jpeg",
        pattern: [0xff, 0xd8, 0xff],
        mask: [0xff, 0xff, 0xff],
      },
      {
        mime: "image/png",
        pattern: [0x89, 0x50, 0x4e, 0x47],
        mask: [0xff, 0xff, 0xff, 0xff],
      },
      // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];

    const check = (bytes: Uint8Array, mime: MimeIdentifierType) => {
      for (var i = 0, l = mime.mask.length; i < l; ++i) {
        if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
          return false;
        }
      }
      return true;
    };

    const blob = file.slice(0, 4); //read the first 4 bytes of the file
    const reader = new FileReader();
    reader.onloadend = function (e) {
      if (
        e.target?.readyState === FileReader.DONE &&
        e.target?.result &&
        typeof e.target?.result !== "string"
      ) {
        var bytes = new Uint8Array(e.target.result);

        for (var i = 0, l = mimes.length; i < l; ++i) {
          if (check(bytes, mimes[i])) {
            resolve(mimes[i].mime);
            break;
          }
        }

        return reject(IMAGEFIELD_ERROR_TYPES.MIME);
      }
    };
    reader.readAsArrayBuffer(blob);
  });
/**
 *
 * @description Takes a File from a FileList for example and converts it to Base64
 */
const createBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    const onLoad = () => {
      reader.removeEventListener("load", onLoad, false);
      if (reader.result) {
        resolve(reader.result?.toString());
      } else {
        reject("Cant create Base64");
      }
    };
    reader.addEventListener("load", onLoad, false);
    reader.readAsDataURL(file);
  });

type ImageFieldPropTypes = {
  label: string;
  value?: string;
  maxFileSize?: number;
  onChange: (image: string) => void;
  onError: (error: string) => void;
};

type ImageFieldPreviewPropTypes = {
  value: string;
};

/**
 *
 * @description Returns a preview of the provided image
 */
export const ImageFieldPreview: React.FC<ImageFieldPreviewPropTypes> = ({
  value = "",
  children = null,
}) => (
  <div className={styles.imagepreview}>
    {!!value ? (
      <img
        className={styles["imagepreview__image"]}
        alt='Preview'
        src={value}
      />
    ) : null}
    {children}
  </div>
);

/**
 *
 * @description Returns an image field that checks for filesize, mimetypes and provides a preview.
 */
export const ImageField: React.FC<ImageFieldPropTypes> = ({
  label = "",
  value = "",
  maxFileSize = 1048576,
  onChange = (image: string) => {},
  onError = (error: string) => {},
}) => {
  return (
    <label className={styles.imagefield}>
      <span className={styles["imagefield__label-text"]}>{label}</span>
      <div className={styles["imagefield__input-wrapper"]}>
        <input
          type='file'
          id='multi'
          className={styles["imagefield__input"]}
          onChange={async ({ target: { files } }) => {
            if (files?.length) {
              const file = files[0];
              try {
                if (files[0].size > maxFileSize) {
                  throw new Error(IMAGEFIELD_ERROR_TYPES.FILESIZE);
                }
                const mimeType = await getMimeType(files[0]);
                if (
                  !["image/jpeg", "image/png"].find(
                    (validMimeType) => mimeType === validMimeType
                  )
                ) {
                  throw new Error(IMAGEFIELD_ERROR_TYPES.MIME);
                }
                const base64Image = await createBase64(file);
                onChange(base64Image);
              } catch (error) {
                if (error === IMAGEFIELD_ERROR_TYPES.MIME) {
                  onError(IMAGEFIELD_ERROR_TYPES.MIME);
                } else if (error === IMAGEFIELD_ERROR_TYPES.FILESIZE) {
                  onError(IMAGEFIELD_ERROR_TYPES.FILESIZE);
                } else {
                  onError(IMAGEFIELD_ERROR_TYPES.UNKNOWN);
                }
              }
            }
          }}
        />
        <ImageFieldPreview value={value}>
          <Button isDisabled={false} onClick={() => {}}>
            Upload your image here
          </Button>
        </ImageFieldPreview>
      </div>
    </label>
  );
};
export default ImageField;
