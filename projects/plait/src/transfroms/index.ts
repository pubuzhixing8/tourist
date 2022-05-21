import { GeneralTransforms } from "./general";
import { ViewportTransforms } from "./viewport";

export const Transforms: GeneralTransforms &
    ViewportTransforms  = {
  ...GeneralTransforms,
  ...ViewportTransforms
}
