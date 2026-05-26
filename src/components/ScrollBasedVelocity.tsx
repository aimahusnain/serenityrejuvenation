import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "./ui/scroll-based-velocity";

export function ScrollBasedVelocity() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="text-7xl font-bold tracking-[-0.02em] md:text-7xl md:leading-20">
        <ScrollVelocityRow baseVelocity={10} direction={1}>
          <span className="inline-flex items-center gap-10 px-8 text-[#07264f] dark:text-[#e3ae72]">
            <span>RESTORE</span>
            <span>REBALANCE</span>
            <span>RENEW</span>
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background/80 dark:from-[#07264f]/80 pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
      <div className="from-background/80 dark:from-[#07264f]/80 pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
    </div>
  );
}
