import { mount } from "@vue/test-utils";
import HomePage from "@/views/tabs/register.vue";

describe("HomePage.vue", () => {
  it("renders home vue", () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch("Ready to create an app?");
  });
});
