function makeJitter(s) {
    return s+m.floor(r()*(50)-25);
}

function drawBranch(x, y, tree, ag, length) {
    a.fillStyle = 'rgb(' + tree.t.join(',') +')';
    a.save();
    a.t(x, y);
    a.rotate(ag);
    a.fillStyle = '#ffe';
    a.f(0, -tree.thickness/2-0.5, length, tree.thickness);
    a.fillStyle = 'rgb(' + tree.t.join(',') +')';
    a.f(0, -tree.thickness/2, length, tree.thickness);
    a.r();
    drawLeaves(x, y, tree, ag);
}

function drawLeaves(x, y, tree, ag, length) {
    a.save();
    a.t(x, y);
    a.rotate(ag);
        a.t(5*g, 0);
    for(i = 0 ; i < tree.leaves.length ; i++) {
        var leaf = tree.leaves[i];
        a.fillStyle = 'rgba(' + leaf.join(',')+')';
        a.f(
            -2*g,
            ((i%2)?-4*g:0)+1*m.cos(p[0]*16+i*m.PI/2),
            (4+m.sin(p[0]*16+i*m.PI/2))*g,
            (4-m.cos(p[0]*16+i*m.PI/2))*g);
        a.t(10*g, 0);
    }
    a.r();
}
function drawTree(x, y, tree, ag) {
    var angle=tree.angle+ag+.01*m.sin(p[tree.level]+tree.phaseOffset);
    g=m.max(g, m.min(1,g+r()*.0001-.000085));
    var l=tree.l*g;
    drawBranch(x,y,tree,angle,l);
    
    for(var i=0;i<tree.c.length;i++) {
        drawTree(
            x+l*m.cos(angle),
            y+l*m.sin(angle),
            tree.c[i],angle
        );
    }
}
function buildTreeData(parent,level) {
    var result = {
        level:level,
        leaves:[],
        t:[
        makeJitter(95),
        makeJitter(79),
        makeJitter(41)
        ],
        thickness:!level?3:parent.thickness - .5,
        phaseOffset:r()*2,
        c:[]
    };
    result.angle=level?(r()-.5)*m.PI/2:0;
    result.beta=r()*.8;
    result.l=level?parent.l*(1-.4*r()):50;
    if(level>1){
        for(k=5;k<result.l;k+=10){
            result.leaves.push([
                makeJitter(142),
                makeJitter(160),
                makeJitter(68),
                (((k-5)/10)%2)?.3:.75
                ]);
        }
    }
    if(level < 5) {
        result.c.push(buildTreeData(result, level+1),buildTreeData(result, level+1),buildTreeData(result, level+1));
        result.level>1?result.c.push(buildTreeData(result,level+1),buildTreeData(result,level+1)):0;
    }
    return result;
}


function draw() {
    for(A=p.length-1;A>=0;A--){
        p[A+1] = p[A];
    }
    p[0] += .1;
    d=a.createLinearGradient(0,0,0,h);
    d.D=d.addColorStop
    d.D(0,'#26b');
    d.D(.7,'#69e');
    d.D(.99,'#fcb');
    d.D(1,'#753');
    a.fillStyle=d;
    a.f(0,0,w,h);
    drawTree(150,h,u,-m.PI/2);
}
m=Math
a.t=a.translate
a.f=a.fillRect
a.r=a.restore
r=m.random
w=c.width=500;
h=c.height=500;
p = [0,0,0,0,0,0,0,0];
g = .001;
u = buildTreeData(null, 0);
setInterval(draw, 42);
