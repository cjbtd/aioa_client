<template>
  <div id="aioa-loading">
    <div class="cube">
      <div class="sides">
        <div class="top"></div>
        <div class="right"></div>
        <div class="bottom"></div>
        <div class="left"></div>
        <div class="front"></div>
        <div class="back"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@keyframes rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}
@keyframes top-animation {
  0% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
}
@keyframes bottom-animation {
  0% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  20% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
  100% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
}
@keyframes front-animation {
  0% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }
  20% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }
}
@keyframes back-animation {
  0% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }
}
@keyframes left-animation {
  0% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }
  20% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }
  100% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }
}
@keyframes right-animation {
  0% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }
  20% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }
  70% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }
  90% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }
  100% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }
}

#aioa-loading {
  z-index: 9997;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #151515;
  opacity: 0.3;

  & * {
    position: absolute;
    width: 6rem;
    height: 6rem;
  }

  .sides {
    animation: rotate 3s ease infinite;
    animation-delay: 0.8s;
    transform-style: preserve-3d;
    transform: rotateX(-37.5deg) rotateY(45deg);

    & > * {
      box-sizing: border-box;
      border: 0.12rem solid white;
      border-radius: 0.25rem;
      background: rgba(0, 0, 0, 0.7);
      animation-fill-mode: forwards;
      transform-origin: 50% 50%;
    }

    .top {
      animation: top-animation 3s ease infinite;
      animation-delay: 0ms;
      transform: rotateX(90deg) translateZ(96px);
    }

    .bottom {
      animation: bottom-animation 3s ease infinite;
      animation-delay: 0ms;
      transform: rotateX(-90deg) translateZ(96px);
    }

    .front {
      animation: front-animation 3s ease infinite;
      animation-delay: 100ms;
      transform: rotateY(0deg) translateZ(96px);
    }

    .back {
      animation: back-animation 3s ease infinite;
      animation-delay: 100ms;
      transform: rotateY(-180deg) translateZ(96px);
    }

    .left {
      animation: left-animation 3s ease infinite;
      animation-delay: 100ms;
      transform: rotateY(-90deg) translateZ(96px);
    }

    .right {
      animation: right-animation 3s ease infinite;
      animation-delay: 100ms;
      transform: rotateY(90deg) translateZ(96px);
    }
  }
}
</style>
