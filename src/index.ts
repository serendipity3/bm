import {Parameters} from "./parameter";
import {Molecules} from "./molecular"
import {BrownianMotion} from "./BrownianMotion"
import {SVG} from "@svgdotjs/svg.js"

function main() {
    const height= 700;
    const width = 700;
    const aspect = width / height;

    var System = new BrownianMotion(aspect);
    var draw = SVG().addTo('#canvas').size(width, height);

    var particles:any[] = new Array(System.particleNumber+1);
    var positions:number[][] = System.getPositions(width);
    for (let i=0;i<=System.particleNumber;i++) {
        particles[i] = draw.circle(System.getRadius(i,width)).attr({ fill: System.particles[i].color });
    };

    var trajectry:number[] = System.getTrajectry(width);
    var trajectryLine = draw.polyline();

    function loop(timestamp:number) {
        for (let i=0;i<=5;i++) {
            System.update();
        };

        positions = System.getPositions(width);
        for (let i=0;i<=System.particleNumber;i++) {
            particles[i].move(positions[i][0], positions[i][1]);
        };

        if (Math.floor(timestamp%6) == 0) {
            var BP_position:number[] = System.getTrajectry(width);
            trajectryLine = draw.polyline([trajectry[0], trajectry[1], BP_position[0], BP_position[1] ]);
            trajectryLine.fill('none');
            trajectryLine.clear();
            trajectryLine.stroke({ color: '#f06', width: 1 });
            trajectry = BP_position;
        };

        window.requestAnimationFrame((ts) => loop(ts));
    };

    window.requestAnimationFrame((ts) => loop(ts));
};

main();
