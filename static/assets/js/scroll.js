// Include this after GSAP scripts
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".scroll-container",
  start: "top 80%",
  onEnter: () => console.log("ScrollTrigger working ✅"),
});croll.js

gsap.utils.toArray(".scroll-float").forEach((elem, i) => {
  gsap.fromTo(
    elem,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "back.inOut(2)",
      scrollTrigger: {
        trigger: elem,
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play none none reverse"
      },
      delay: i * 0.05
    }
  );
});
