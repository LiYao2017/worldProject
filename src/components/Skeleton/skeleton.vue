<template>
  <div class="skeleton page">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton{
  height: 100vh;
  overflow: hidden;
}

.loading {
  width: 150px;
  height: 15px;
  margin: 0 auto;
  margin-top: 30%;
}

.loading span {
  display: inline-block;
  width: 15px;
  height: 100%;
  margin-right: 5px;
  border-radius: 50%;
  background: lightgreen;
  -webkit-animation: load 1.04s ease infinite;
}

.loading span:last-child {
  margin-right: 0;
}
@-webkit-keyframes load {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.3);
  }

  100% {
    opacity: 0.2;
    -webkit-transform: scale(0.3);
  }
}

.loading span:nth-child(1) {
  -webkit-animation-delay: 0.13s;
}

.loading span:nth-child(2) {
  -webkit-animation-delay: 0.26s;
}

.loading span:nth-child(3) {
  -webkit-animation-delay: 0.39s;
}

.loading span:nth-child(4) {
  -webkit-animation-delay: 0.52s;
}

.loading span:nth-child(5) {
  -webkit-animation-delay: 0.65s;
}
</style>
