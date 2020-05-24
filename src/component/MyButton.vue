<template>
	<button id="reset" v-on:click="reset">reset</button>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class MyButton extends Vue{
    }
</script>
