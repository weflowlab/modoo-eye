// 관리자 대시보드 맨 위에 "유입 관리" 들어가는 버튼 (payload.config admin.components.beforeDashboard).
import Link from "next/link";

export function DashboardTrafficLink() {
  return (
    <div className="dashboard-traffic">
      <div>
        <strong>유입 관리</strong>
        <span>방문자가 어디서 들어와 어떤 글을 보는지, 상담 버튼은 얼마나 눌렀는지 봅니다.</span>
      </div>
      <Link href="/admin/traffic" className="btn btn--style-primary btn--size-medium" prefetch={false}>
        유입 관리 보기
      </Link>
    </div>
  );
}
