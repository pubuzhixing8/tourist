export type Path = number[];

export interface PathInerface {
    parent: (path: Path) => Path;
}

export const Path: PathInerface = {
    parent(path: Path): Path {
        if (path.length === 0) {
            throw new Error(`Cannot get the parent path of the root path [${path}].`);
        }

        return path.slice(0, -1);
    }
};
