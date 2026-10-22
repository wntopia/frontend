// Next는 error 파일이 클라이언트 컴포넌트인지 이 파일의 지시문으로 판단한다.
// 가져오는 컴포넌트가 이미 클라이언트여도 여기에 없으면 빌드가 실패한다.
"use client";

import { ErrorPage } from "@/views/error";
export default ErrorPage;
