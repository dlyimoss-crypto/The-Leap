import { describe, expect, test } from "vitest";
import { checkForCrisisLanguage } from "./crisis-detection";

describe("checkForCrisisLanguage", () => {
  test("benign prayer request is not flagged", () => {
    expect(
      checkForCrisisLanguage("Please pray for my job interview next week."),
    ).toEqual({ flagged: false });
  });

  test("mention of suicide is flagged", () => {
    expect(
      checkForCrisisLanguage("I've been thinking about suicide lately."),
    ).toEqual({ flagged: true, matchedTerm: "suicide" });
  });

  test("mention of self-harm is flagged", () => {
    expect(
      checkForCrisisLanguage("Some nights I think about hurting myself."),
    ).toEqual({ flagged: true, matchedTerm: "hurting myself" });
  });

  test("mention of abuse is flagged regardless of case", () => {
    expect(
      checkForCrisisLanguage("I'm scared because I'M BEING ABUSED at home."),
    ).toEqual({ flagged: true, matchedTerm: "being abused" });
  });

  test("mention of immediate danger is flagged", () => {
    expect(
      checkForCrisisLanguage("He's here right now and I'm in immediate danger."),
    ).toEqual({ flagged: true, matchedTerm: "immediate danger" });
  });

  test("general hopelessness language is flagged", () => {
    expect(
      checkForCrisisLanguage("Honestly I don't want to be here anymore."),
    ).toEqual({ flagged: true, matchedTerm: "don't want to be here anymore" });
  });

  test("hopelessness language is flagged even with a smart apostrophe", () => {
    expect(
      checkForCrisisLanguage("Honestly I don’t want to be here anymore."),
    ).toEqual({ flagged: true, matchedTerm: "don't want to be here anymore" });
  });
});
