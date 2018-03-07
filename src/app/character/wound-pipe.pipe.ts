import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "woundName"
})
export class WoundPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case "head":
        return "Head";
      case "chest":
        return "Chest";
      case "abdomen":
        return "Abdomen";
      case "leftArm":
        return "Left arm";
      case "rightArm":
        return "Right arm";
      case "leftLeg":
        return "Left leg";
      case "rightLeg":
        return "Right leg";
    }
  }

}
