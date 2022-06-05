export class TreeNode {
    width: number;
    height: number;
    x: number;
    y: number;
    children: TreeNode[];
    constructor(width: number, height: number) {
      this.width = width
      this.height = height
      this.x = 0
      this.y = 0
      this.children = []
    }
  
    addChild(child: TreeNode) {
      child.y = this.y + this.height
      this.children.push(child)
    }
  
    randExpand(tree: TreeNode) {
      tree.y += this.height
      const i = Math.floor(Math.random() * (this.children.length + 1))
      if (i === this.children.length) {
        this.children.push(tree)
      } else {
        this.children[i].randExpand(tree)
      }
    }
  }