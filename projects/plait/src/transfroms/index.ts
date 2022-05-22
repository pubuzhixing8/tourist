import { GeneralTransforms } from "./general";
import { SelectionTransforms } from "./selection";
import { ViewportTransforms } from "./viewport";

export const Transforms: GeneralTransforms &
  ViewportTransforms & SelectionTransforms = {
  ...GeneralTransforms,
  ...ViewportTransforms,
  ...SelectionTransforms
}
