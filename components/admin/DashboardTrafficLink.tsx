// 관리자 대시보드에 "통계" 묶음을 추가한다 (payload.config admin.components.afterDashboard).
// Payload 가 그리는 "콘텐츠"·"설정" 묶음과 똑같은 마크업(widget > collections > collections__wrap > collections__group > Card)을 써서
// 간격·폭·글자 크기가 같은 모양으로 보인다.
import { Card } from "@payloadcms/ui";

export function DashboardTrafficLink() {
  return (
    <div className="widget dashboard-stats-widget" style={{ width: "100%", padding: 6 }}>
      <div className="collections">
        <div className="collections__wrap">
          <div className="collections__group">
            <h2 className="collections__label">통계</h2>
            <ul className="collections__card-list">
              <li>
                <Card id="card-traffic" title="유입 관리" titleAs="h3" href="/admin/traffic" buttonAriaLabel="유입 관리 보기" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
