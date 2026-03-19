export function makeResponsive(svg: SVGSVGElement): void {
  const viewBox = svg.viewBox.baseVal;
  if (!viewBox || viewBox.width === 0) return;

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.maxWidth = `${viewBox.width}px`;

  // Ensure touch targets are large enough on mobile
  if (window.innerWidth < 768) {
    svg.querySelectorAll("g.station circle").forEach((circle) => {
      const r = parseFloat(circle.getAttribute("r") || "5");
      if (r < 22) {
        // Add invisible hit area for touch
        const hitArea = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        hitArea.setAttribute("cx", circle.getAttribute("cx") || "0");
        hitArea.setAttribute("cy", circle.getAttribute("cy") || "0");
        hitArea.setAttribute("r", "22");
        hitArea.setAttribute("fill", "transparent");
        hitArea.setAttribute("class", "touch-target");
        circle.parentElement?.insertBefore(hitArea, circle);
      }
    });
  }
}
