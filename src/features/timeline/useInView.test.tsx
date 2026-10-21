import { act, render, screen } from '@testing-library/react';
import { useInView, type InViewEnvironment } from '@/features/timeline/useInView';

function Probe({ environment }: { readonly environment: InViewEnvironment }) {
  const [ref, inView] = useInView<HTMLDivElement>(environment);
  return <div ref={ref}>{inView ? 'visible' : 'hidden'}</div>;
}

type Callback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void;

function fakeObserver() {
  const state: { callback?: Callback; disconnected: boolean; observed: Element[] } = {
    disconnected: false,
    observed: [],
  };
  class FakeIntersectionObserver {
    constructor(callback: Callback) {
      state.callback = callback;
    }
    observe(element: Element) {
      state.observed.push(element);
    }
    disconnect() {
      state.disconnected = true;
    }
  }
  return {
    state,
    ctor: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
  };
}

describe('useInView', () => {
  it('is immediately visible when IntersectionObserver is unavailable', () => {
    render(
      <Probe environment={{ IntersectionObserver: undefined, prefersReducedMotion: false }} />,
    );

    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('is immediately visible when the user prefers reduced motion', () => {
    const { ctor } = fakeObserver();
    render(<Probe environment={{ IntersectionObserver: ctor, prefersReducedMotion: true }} />);

    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('becomes visible once the element intersects and stops observing', () => {
    const { ctor, state } = fakeObserver();
    render(<Probe environment={{ IntersectionObserver: ctor, prefersReducedMotion: false }} />);

    expect(screen.getByText('hidden')).toBeInTheDocument();
    expect(state.observed).toHaveLength(1);

    act(() => state.callback?.([{ isIntersecting: true }]));

    expect(screen.getByText('visible')).toBeInTheDocument();
    expect(state.disconnected).toBe(true);
  });
});
