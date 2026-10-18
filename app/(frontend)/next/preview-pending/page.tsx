// 관리자 미리보기 창에 보여 주는 안내 화면. 새 글에서 카테고리나 URL 경로가 아직 없어 실제 페이지 주소를 만들 수 없을 때 쓴다.
export default function PreviewPendingPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <p className="text-lg font-bold text-foreground">미리보기를 준비 중입니다</p>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          왼쪽에서 <strong>카테고리</strong>를 고르고 <strong>제목</strong>을 입력하면 잠시 후 이 자리에 실제 글 페이지가 나타납니다.
        </p>
      </div>
    </main>
  );
}
