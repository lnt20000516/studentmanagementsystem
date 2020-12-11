<template>
  <div class="inputBox">
    <input
      type="text"
      class="effect-2"
      :placeholder="placeholder"
      v-model="currentValue"
      @input="handleModelInput"
    />
    <span class="focus-border">
      <i></i>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: "",
    value: [String, Number],
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue;
    },
  },
  methods: {
    handleModelInput(event) {
      const value = event.target.value;
      this.$emit("input", value);
      if (this.$parent.$options.componentName === "ElFormItem") {
        if (this.validateEvent) {
          this.$parent.$emit("el.form.change", [value]);
        }
      }
      this.$emit("change", value);
    },
  },
};
</script>
<style>
.inputBox {
  width: 27.33%;
  position: relative;
}
input[type="text"] {
  font: 15px/24px "Lato", Arial, sans-serif;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  letter-spacing: 1px;
}
:focus {
  outline: none;
}
.effect-2 {
  border: 1px solid #ccc;
  padding: 7px 14px 9px;
  transition: 0.4s;
}
.effect-2 ~ .focus-border:before,
.effect-2 ~ .focus-border:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0.5px;
  background-color: #6359d9;
  transition: 0.3s;
}
.effect-2 ~ .focus-border:after {
  top: auto;
  bottom: 0;
  left: auto;
  right: 0;
}
.effect-2 ~ .focus-border i:before,
.effect-2 ~ .focus-border i:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 0;
  background-color: #6359d9;
  transition: 0.4s;
}
.effect-2 ~ .focus-border i:after {
  left: auto;
  right: 0;
  top: auto;
  bottom: 0;
}
.effect-2:focus ~ .focus-border:before,
.effect-2:focus ~ .focus-border:after {
  width: 100%;
  transition: 0.3s;
}
.effect-2:focus ~ .focus-border i:before,
.effect-2:focus ~ .focus-border i:after {
  height: 100%;
  transition: 0.4s;
}
</style>