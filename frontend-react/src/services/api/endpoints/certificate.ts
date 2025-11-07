import axiosInstance from "../axios-instance";

async function addCertificate(data: Payloads.AddCertificate) {
  const response = await axiosInstance.post<MessageRes>('/certificate', data);
  return response.data;
}

async function updateCertificate(certificateId: number, data: Payloads.UpdateCertificate) {
  const response = await axiosInstance.patch<CertificateAPI.UpdateCertificateRes>(`/certificate/${certificateId}`, data);
  return response.data;
}

async function deleteCertificate(certificateId: number) {
  const response = await axiosInstance.delete<MessageRes>(`/certificate/${certificateId}`);
  return response.data;
}

async function listMyCertificates() {
  const response = await axiosInstance.get<CertificateAPI.ListCertificatesRes>('/certificate/my');
  return response.data.certificates;
}

async function listCertificatesByUser(userId: number) {
  const response = await axiosInstance.get<CertificateAPI.ListCertificatesRes>(`/certificate/user/${userId}`);
  return response.data.certificates;
}

async function listAllCertificates() {
  const response = await axiosInstance.get<CertificateAPI.ListCertificatesRes>('/certificate/all');
  return response.data.certificates;
}

async function listCertificatesByDateRange(startDate: string, endDate: string) {
  const response = await axiosInstance.get<CertificateAPI.ListCertificatesRes>('/certificate/date-range', {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data.certificates;
}

export default {
  addCertificate,
  updateCertificate,
  deleteCertificate,
  listMyCertificates,
  listCertificatesByUser,
  listAllCertificates,
  listCertificatesByDateRange
};
