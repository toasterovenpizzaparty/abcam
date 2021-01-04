import { useCallback } from "react";
import { ActionTypes } from "../reducers/api-reducer/api-reducer";
import { AxiosResponse, AxiosError } from "axios";
import { client } from "../../providers/axios";
import { useDispatch } from "../../hooks/shared-state";
import { FIELDS } from "../../config/form-types";
import { createSaveFieldActionPayload } from "./fields";

type CreateFinishRequestPropTypes = {
  data?: AxiosResponse | null;
  error?: AxiosError | null;
};
/**
 *
 * @description Create a payload to start an API Request
 */
const createStartRequestPayload = () => ({
  type: ActionTypes.START_REQUEST,
});

/**
 *
 * @description Create a payload to finish an API Request
 */
const createFinishRequestPayload = ({
  data = null,
  error = null,
}: CreateFinishRequestPropTypes) => ({
  type: ActionTypes.FINISH_REQUEST,
  data: data,
  error: error,
});

/**
 *
 * @description Provides a hook to send an API Request to create a review
 */
export const useCreateReviewAction = () => {
  const dispatch = useDispatch();
  return useCallback(
    async (title: string, rating: string) => {
      dispatch(createStartRequestPayload());
      try {
        const response = await client().request({
          url: "/reviews",
          method: "POST",
          data: {
            title,
            rating,
          },
        });
        if (response?.data?.id) {
          dispatch(
            createSaveFieldActionPayload(
              response?.data?.id,
              FIELDS.TITLE,
              title
            )
          );
          dispatch(
            createSaveFieldActionPayload(
              response?.data?.id,
              FIELDS.RATING,
              rating
            )
          );
        }
        dispatch(createFinishRequestPayload({ data: response?.data }));
        return response;
      } catch (error) {
        dispatch(createFinishRequestPayload({ error }));
        return false;
      }
    },
    [dispatch]
  );
};

type UpdateReviewActionPropTypes = {
  title?: string;
  rating?: string;
  description?: string;
  image?: string;
  imageDescription?: string;
};
/**
 *
 * @description Provides a hook to send an API Request to update a review
 */
export const useUpdateReviewAction = () => {
  const dispatch = useDispatch();
  return useCallback(
    async (payload: UpdateReviewActionPropTypes) => {
      dispatch(createStartRequestPayload());
      try {
        await client().request({
          url: "/reviews",
          method: "PUT",
          data: {
            ...payload,
          },
        });
        dispatch(createFinishRequestPayload({}));
        return true;
      } catch (error) {
        dispatch(createFinishRequestPayload({ error }));
        return false;
      }
    },
    [dispatch]
  );
};
