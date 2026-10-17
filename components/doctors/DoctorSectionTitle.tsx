// 의료진 상세의 섹션 제목(연혁/진료 이야기). 앞에 작은 primary 사각형 마커가 붙는다.
type Props = { children: React.ReactNode };

export function DoctorSectionTitle({ children }: Props) {
  return (
    // 레퍼런스: size-2 bg-primary 마커 + text-xl md:text-3xl
    <h2 className="text-xl font-bold text-neutral-800 md:text-3xl">
      <span className="mr-3 inline-block size-2 bg-primary align-middle" />
      {children}
    </h2>
  );
}
