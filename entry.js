function makeJitter(s) {
    return s + Math.floor(Math.random() * 25);
}

function drawBranch(x, y, tree, angle, length) {
    a.fillStyle = 'rgb(' + tree.tint.join(',') + ')';
    a.save();
    a.translate(x, y);
    a.rotate(angle);
    a.fillStyle = '#ffe';
    a.fillRect(0, -tree.thickness / 2 - 0.5, length, tree.thickness);
    a.fillStyle = 'rgb(' + tree.tint.join(',') + ')';
    a.fillRect(0, -tree.thickness / 2, length, tree.thickness);
    a.restore();
    drawLeaves(x, y, tree, angle);
}

function drawLeaves(x, y, tree, angle) {
    a.save();
    a.translate(x, y);
    a.rotate(angle);
    a.translate(5*growth, 0);
    for(i = 0 ; i < tree.leaves.length ; i++) {
        var leaf = tree.leaves[i];
        a.fillStyle = 'rgba(' + leaf.join(',') + ')';
        a.fillRect(
            -2 * growth,
            ((i % 2) ? -4 * growth : 0) + 1 * Math.cos(phase[0] * 16 + i * Math.PI / 2),
            ( 4 + Math.sin(phase[0] * 16 + i * Math.PI / 2)) * growth,
            ( 4 - Math.cos(phase[0] * 16 + i * Math.PI / 2)) * growth);
        a.translate(10 * growth, 0);
    }
    a.restore();
}
function drawTree(x, y, tree, angle) {
    var angle = tree.angle + angle + .01 * Math.sin(phase[tree.level] + tree.phaseOffset);
    growth = Math.max(growth, Math.min(1, growth + Math.random() * .0001 - .000085));
    var length = tree.length * growth;
    drawBranch(x, y, tree, angle, length);
    
    for(var i = 0 ; i < tree.children.length ; i++) {
        drawTree(
            x + length * Math.cos(angle),
            y + length * Math.sin(angle),
            tree.children[i], angle
        );
    }
}
function buildTreeData(parent, level) {
    var result = {
        level: level,
        leaves: [],
        tint: [
            makeJitter(95),
            makeJitter(79),
            makeJitter(41)
        ],
        thickness: !level ? 3 : (parent.thickness - .5),
        phaseOffset: Math.random() * 2,
        children: []
    };
    result.angle = level ? (Math.random() - .5) * Math.PI / 2:0;
    result.beta = Math.random() * .8;
    result.length = level ? parent.length * (1 - .4 * Math.random()):50;
    if(level > 1) {
        for(k = 5 ; k < result.length ; k += 10){
            result.leaves.push([
                makeJitter(142),
                makeJitter(160),
                makeJitter(68),
                (((k - 5) / 10) % 2) ? .3 : .75
                ]);
        }
    }
    if(level < 5) {
        result.children.push(
            buildTreeData(result, level + 1),
            buildTreeData(result, level + 1),
            buildTreeData(result, level + 1)
        );
        if(result.level > 1) {
            result.children.push(
                buildTreeData(result, level + 1),
                buildTreeData(result, level + 1)
            );
        }
    }
    return result;
}


function draw() {
    var i,
        gradient;
    for(i = p.length - 1 ; i >= 0 ; i--) {
        phase[i + 1] = phase[i];
    }
    phase[0] += .1;
    gradient = a.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0,'#26b');
    gradient.addColorStop(.7,'#69e');
    gradient.addColorStop(.99,'#fcb');
    gradient.addColorStop(1,'#753');
    a.fillStyle = gradient;
    a.fillRect(0, 0, canvas.width, canvas.height);
    drawTree(150, height, u, -Math.PI/2);
}

canvas.width = 500;
canvas.height = 500;
phase = [0, 0, 0, 0, 0, 0, 0, 0];
var growth = .001;
u = buildTreeData(null, 0);
setInterval(draw, 42);
