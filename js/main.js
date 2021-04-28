const mazeWidth = 10;
const mazeHeight = 10;

class Node {
    constructor(x, y) 
    {

        // idk how i feel abt the node being placed
        // in space??
        this.x = x;
        this.y = y;

        this.visited = false;
        this.edges = []; // point to node
        this.paths = [];
    }

    generate() 
    {
        this.visited = true; // mark we were here

        // shuffle edges
        for (let i = this.edges.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.edges[i];
            this.edges[i] = this.edges[j];
            this.edges[j] = temp;
        }

        this.edges.forEach(edge => {
            if(edge.visited)
                return

            this.paths.push(edge);
            edge.generate();
        });
    }
}

class Maze {
    
    constructor(w, h) 
    {
        this.w = w;
        this.h = h;

        this.graph;

        // lazy initialization
    }

    index(x, y) {
        if(x < 0 || y < 0 || x > this.w - 1 || y > this.h - 1)
            return -1;

        return x + y * this.w;
    }

    // filled graph = graph where adjacent nodes are edged
    generateFilledGraph() 
    {
        let graph = [];
        for(let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                graph.push(new Node(x, y)); // all nodes start "blank"
            }
        }

        for(let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                const node = graph[this.index(x, y)];

                let up    = this.index(x    , y - 1);
                let right = this.index(x + 1, y    );
                let down  = this.index(x    , y + 1);
                let left  = this.index(x - 1, y    );

                if(up != -1)
                    node.edges.push(graph[up]);
                if(right != -1)
                    node.edges.push(graph[right]);
                if(down != -1)
                    node.edges.push(graph[down]);
                if(left != -1)
                    node.edges.push(graph[left]);
            }
        }

        return graph; // technically we could just return head node
                      // might consider this in the future?
    }

    generateMaze() 
    {
        this.graph = this.generateFilledGraph();

        // run recursive backtracking to generate maze
        let head = this.graph[0];
        head.generate();

    }

    showMaze() {
        let offset = 50;
        let scale = 50;

        rectMode(CENTER);

        for(let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                const node = this.graph[this.index(x, y)];

                let centerX = x * scale + offset;
                let centerY = y * scale + offset;

                stroke(0);
                strokeWeight(1);
                
                // this is a poop way to approach this
                // brain no want to think more

                // is this a face with a path?
                    // yes, continue
                    // no,  draw the face

                let up = false;
                let down = false;
                let right = false;
                let left = false;

                node.paths.forEach(path => {
                    if (path.y < node.y) { //up
                        up = true;
                    }
                    else if (path.y > node.y) {// down
                        down = true;
                    }
                    else if (path.x < node.x) {// left
                        left = true;
                    }
                    else {// right
                        right = true;
                    }
                });

                if (!up) {
                    line(centerX - scale/2, centerY - scale/2, centerX + scale/2, centerY - scale/2)
                }
                else if (!down) {
                    line(centerX - scale/2, centerY + scale/2, centerX + scale/2, centerY + scale/2)
                }
                else if (!left) {
                    line(centerX - scale/2, centerY - scale/2, centerX - scale/2, centerY + scale/2)
                }
                else if (!right) {
                    line(centerX + scale/2, centerY - scale/2, centerX + scale/2, centerY + scale/2)
                }
            }
        }
    }

    showPaths() 
    {
        let offset = 50;
        let scale = 50;

        for(let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                const node = this.graph[this.index(x, y)];

                let centerX = x * scale + offset;
                let centerY = y * scale + offset;

                stroke(0, 255, 0);
                strokeWeight(10);
                point(centerX, centerY);

                stroke(200);
                strokeWeight(5);
                node.paths.forEach(nbour => {
                    line(centerX, centerY, nbour.x * scale + offset, nbour.y * scale + offset);
                });
            }
        }
    }
}

function setup() {
    createCanvas(1500, 1500);

    maze = new Maze(69,69);
    maze.generateMaze();

    maze.showPaths();
//    maze.showMaze();
}

