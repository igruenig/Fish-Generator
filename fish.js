class Fish {
  constructor(x, y, width, height, showHandles) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.showHandles = showHandles;

    this.dimensions = {
      tailBack: this.height / 3,
      tailWidth: this.width / 6
    };

    this.parts = {};
  }

  edges() {
    const dimensions = this.dimensions;

    return {
      tailTop: {
        x: this.x,
        y: this.y + this.height / 2 - dimensions.tailBack / 2
      },
      tailBottom: {
        x: this.x,
        y: this.y + this.height / 2 + dimensions.tailBack / 2
      },
      bodyBack: {
        x: this.x + dimensions.tailWidth,
        y: this.y + this.height / 2
      },
      bodyFront: {
        x: this.x + this.width,
        y: this.y + this.height / 2
      }
    };
  }

  pointOnPart(part, t) {
    const x = bezierPoint(
      part.start.x,
      part.controlPointStart.x,
      part.controlPointEnd.x,
      part.end.x,
      t
    );

    const y = bezierPoint(
      part.start.y,
      part.controlPointStart.y,
      part.controlPointEnd.y,
      part.end.y,
      t
    );

    return { x, y };
  }

  randomizeBody(part) {
    part.updateControlPoint(
      "start",
      random(-HALF_PI, -QUARTER_PI),
      random(0.1, 0.4)
    );
    part.updateControlPoint("end", random(-HALF_PI, 0), random(0.3, 0.4));
  }

  randomizeTail(part) {
    part.updateControlPoint("start", -HALF_PI, random(0.05, 0.4));
    part.updateControlPoint("end", -HALF_PI, random(0.05, 0.4));
  }

  randomColor() {
    colorMode(HSL);
    return color(random(360), random(50, 95), random(50, 95));
  }

  display() {
    this.dimensions.tailBack = random(this.height / 8, this.height / 2);
    this.dimensions.tailWidth = random(this.width / 5, this.width / 10);
    const p = this.edges();

    const upperTailBottom = new BezierPart(
      p.bodyBack.x,
      p.bodyBack.y,
      p.tailTop.x,
      p.tailTop.y
    );
    const upperTailTop = new BezierPart(
      p.tailTop.x,
      p.tailTop.y,
      p.bodyBack.x,
      p.bodyBack.y
    );
    const upperBody = new BezierPart(
      p.bodyBack.x,
      p.bodyBack.y,
      p.bodyFront.x,
      p.bodyFront.y
    );
    this.randomizeBody(upperBody);

    const lowerBody = new BezierPart(
      p.bodyFront.x,
      p.bodyFront.y,
      p.bodyBack.x,
      p.bodyBack.y
    );
    this.randomizeBody(lowerBody);

    const lowerTailBottom = new BezierPart(
      p.bodyBack.x,
      p.bodyBack.y,
      p.tailBottom.x,
      p.tailBottom.y
    );
    this.randomizeTail(lowerTailBottom);

    const lowerTailTop = new BezierPart(
      p.tailBottom.x,
      p.tailBottom.y,
      p.bodyBack.x,
      p.bodyBack.y
    );
    this.randomizeTail(lowerTailTop);

    const upperFinnStart = this.pointOnPart(upperBody, 0.4);
    const upperFinnEnd = this.pointOnPart(upperBody, 0.3);
    const upperFinnTop = {
      x: upperFinnEnd.x - 20,
      y: upperFinnEnd.y - random(20, 30)
    };

    push();

    const finnColor = this.randomColor();

    beginShape();
    fill(finnColor);
    curveVertex(upperFinnStart.x, upperFinnStart.y);
    curveVertex(upperFinnStart.x, upperFinnStart.y);
    curveVertex(upperFinnTop.x, upperFinnTop.y);
    curveVertex(upperFinnEnd.x, upperFinnEnd.y);
    curveVertex(upperFinnEnd.x, upperFinnEnd.y);
    endShape();

    const lowerFinnStart = this.pointOnPart(lowerBody, 0.35);
    const lowerFinnEnd = this.pointOnPart(lowerBody, 0.5);
    const lowerFinnBottom = { x: lowerFinnEnd.x - 20, y: lowerFinnEnd.y + 25 };

    beginShape();
    fill(finnColor);
    curveVertex(lowerFinnStart.x, lowerFinnStart.y);
    curveVertex(lowerFinnStart.x, lowerFinnStart.y);
    curveVertex(lowerFinnBottom.x, lowerFinnBottom.y);
    curveVertex(lowerFinnEnd.x, lowerFinnEnd.y);
    curveVertex(lowerFinnEnd.x, lowerFinnEnd.y);
    endShape();

    pop();

    upperBody.display();
    lowerBody.display();

    // Stripes
    const coords = [];
    const steps = int(random(8, 18));
    const distanceUpper = 0.65 / steps;
    const distanceLower = 0.75 / steps;

    for (let i = 0; i < steps; i++) {
      const upper = this.pointOnPart(upperBody, 0.05 + i * distanceUpper);
      const lower = this.pointOnPart(lowerBody, 1 - (0.05 + i * distanceLower));
      coords.push({ upper, lower });
    }

    push();
    strokeWeight(1);
    for (let i = 0; i < coords.length - 5; i++) {
      line(
        coords[i].upper.x,
        coords[i].upper.y,
        coords[i + 5].lower.x,
        coords[i + 5].lower.y
      );
    }
    for (let i = 1; i < coords.length; i++) {
      line(
        coords[i].upper.x,
        coords[i].upper.y,
        coords[i - 1].lower.x,
        coords[i - 1].lower.y
      );
    }
    pop();

    const colorForInnerTail = this.randomColor()
    const colorForOuterTail = this.randomColor()

    const innerTailColor = () => colorForInnerTail
    const outerTailColor = () => colorForOuterTail

    upperTailBottom.color = innerTailColor
    upperTailBottom.display();
    upperTailTop.color = outerTailColor
    upperTailTop.display();

    lowerTailBottom.color = outerTailColor
    lowerTailBottom.display();
    lowerTailTop.color = innerTailColor
    lowerTailTop.display();

    // Eye
    const fishWidth = upperBody.end.x - upperBody.start.x;
    const eyeX =
      bezierPoint(
        upperBody.start.x,
        upperBody.controlPointStart.x,
        upperBody.controlPointEnd.x,
        upperBody.end.x,
        0.85
      ) -
      fishWidth / 10;
    const topY = bezierPoint(
      upperBody.start.y,
      upperBody.controlPointStart.y,
      upperBody.controlPointEnd.y,
      upperBody.end.y,
      0.85
    );
    const bottomY = bezierPoint(
      lowerBody.end.y,
      lowerBody.controlPointEnd.y,
      lowerBody.controlPointStart.y,
      lowerBody.start.y,
      0.85
    );
    const eyeY = topY + (1 / 4) * (bottomY - topY);
    const fishEyeSize = max(0.4 * (bottomY - topY), 15);

    push();
    noStroke();
    fill(255);
    ellipse(eyeX, eyeY, fishEyeSize, fishEyeSize);

    fill(0);
    ellipse(eyeX, eyeY, 0.4 * fishEyeSize, 0.4 * fishEyeSize);
    pop();

    /*
    // Testing
    upperBody.displayControls()
    lowerBody.displayControls()
    upperTailBottom.displayControls()
    upperTailTop.displayControls()
    lowerTailBottom.displayControls()
    lowerTailTop.displayControls()
    */
  }
}

class BezierPart {
  constructor(x1, y1, x2, y2) {
    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);
    this.color = () => {
      colorMode(HSL);
      return color(random(360), random(55, 90), random(55, 90));
    };

    this.updateControlPoint("start", -HALF_PI, 0.25);
    this.updateControlPoint("end", -HALF_PI, 0.25);
  }

  updateControlPoint(point, angle, scale) {
    const line = p5.Vector.sub(this.end, this.start);
    const normal = line
      .copy()
      .normalize()
      .rotate(angle)
      .mult(line.mag() * scale);
    if (point === "start") {
      this.controlPointStart = p5.Vector.add(
        this.start,
        p5.Vector.mult(line, 0.25)
      ).add(normal);
    }
    if (point === "end") {
      this.controlPointEnd = p5.Vector.add(
        this.start,
        p5.Vector.mult(line, 0.75)
      ).add(normal);
    }
  }

  display() {
    push();
    beginShape();
    fill(this.color());
    vertex(this.start.x, this.start.y);
    bezierVertex(
      this.controlPointStart.x,
      this.controlPointStart.y,
      this.controlPointEnd.x,
      this.controlPointEnd.y,
      this.end.x,
      this.end.y
    );
    endShape();
    pop();
  }

  displayControls() {
    const radius = 3;

    ellipse(
      this.controlPointStart.x,
      this.controlPointStart.y,
      radius * 2,
      radius * 2
    );
    ellipse(
      this.controlPointEnd.x,
      this.controlPointEnd.y,
      radius * 2,
      radius * 2
    );
  }
}