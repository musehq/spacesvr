import styled from "@emotion/styled";
import { useControlledProgress } from "../utils/loading";

const Container = styled.div<{ finished: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  background: white;
  transition: opacity 0.75s ease-in;
  transition-delay: 0.5s;
  opacity: ${(props) => (props.finished ? "0" : "1")};
  pointer-events: ${(props) => (props.finished ? "none" : "all")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default function LoadingScreen() {
  const progress = useControlledProgress();
  const loadingGif =
    "https://spaces-gallery-assets.s3.us-west-1.amazonaws.com/gif/mort_pause_menu_512.gif?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAUaCXVzLXdlc3QtMSJIMEYCIQDX9ZmrfOi9Ln3nPsoFH1CpJlUaQ5zyXHWzOyGjDoXoZgIhAL5bP%2BpVd0vpUEH4YUCpdWeHe5vonbWYqsyreqnE75T7Kv8CCL7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMNzQxMzU1NzYzODI0Igz32Vbh3y%2Fay3M13mgq0wLDw6yrYJkv2txA0iF%2B0MAtO9%2FpbZGitRqExvaTZi1ZIDM%2BKzvF4SKtfnniXzCqIgPWUidn2xfIPUIguJr24Jjf4DOgUs628%2Bkk7gqBkWQ3tDen2EaF41HvlyyLPsuA%2FZPEv86S5JryGnWPhxvf0RN6BuNvrmOcF7DytoRukDKeAdEq2pANVsQzPV7V%2BUF%2BCa%2FMnIVE%2FbIQrT1Khnb2qZhvrQ03DolvNq%2F%2F3aK8oQpldPa3mO5ZKC8zpTGpWVU8nNSJYyinhyHzqGj3koViuY6tyUVNu4ENQNSoyEZzCVeRJYIrASSZ6enlUZC%2FZZAcvihafFoptJHvzh2LhdROwrWC3giG14WwLfON7GexQZd0WXDsl9w1HXE007EJlNCMZ94mLoDfv6l8KvwbZOH556tilfuNmNrcajuIO%2F6b8E7iLEHkdTCc%2FdZ2659R8MBvYHLCYqow6aLZjAY6sgIO4mcy4cfeJ3V%2FZ8S6zQbDJjZ1JB8fJz8lRYnUmANEoAO2AjNG2XpRCFxzJ1RnMskj4Q6xS4I1niOAvubftk71SHUFuDNqy5WO93xAz%2F5UZ0GBiePXtHKur8F%2Fd%2F2x%2FhrMMHBGw%2BfC%2B%2BJCIA21iPtaa4bh%2FjXK90AXZMhCvD0RR4BP4y1Q%2Ftp1TK0Szd8%2FvisKvhTZiSDgZLrdQ1gwYBUoKk1V9xEIrm7CZ3g2vJb%2BJn8jAl4nxwzBsNQXFHJL2X9%2FJHogmKfGiFhU1c4%2B53eIjCjI1KuvD3OiP8Z1r%2Fa1LkVOU1nR4pOZuXv0VsI3BD6apWNRStljU3etGL7PHd%2Fjk4mIooqRnYPkMhsjtEx%2FBzkwZ3F9eMeUnshle0fVLleQiO8QWsv1yI5cLudTNf9jkR0%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20211118T131448Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2ZHB7HBYNUHJZ6GT%2F20211118%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=7bd87e2603c0cdb7161e205d891555ee5a370e9afefec1a4da2a3c7195eb43d6";

  return (
    <>
      <Container finished={progress === 100}>{Math.round(progress)}%</Container>
      <img src={loadingGif} alt="loading..." />
    </>
  );
}
