import React, { useState } from 'react';
// supabase 클라이언트를 가져옵니다. 경로는 프로젝트 구조에 따라 다를 수 있습니다.
import { supabase } from '../lib/supabase';

// 파일 업로드에 사용할 버킷 이름 (사용자가 확인한 이름)
const BUCKET_NAME = 'archive_files';

function WorkForm({ onWorkCreated }: { onWorkCreated: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null); // 파일 객체를 저장할 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 사용자가 파일을 선택했을 때, 첫 번째 파일 객체를 상태에 저장
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || !file || !title) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Supabase Storage에 파일 업로드
            // 파일 이름 충돌을 피하기 위해 타임스탬프와 원래 파일 이름을 조합하여 사용합니다.
            const filePath = `${Date.now()}-${file.name}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600', // 캐시 설정
                    upsert: false, // 덮어쓰지 않음
                });

            if (uploadError) throw uploadError;

            // 2. 업로드된 파일의 공개 URL 가져오기
            // Supabase Storage는 기본적으로 공개 접근이 가능하도록 설정되어 있어야 합니다.
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(uploadData.path);

            const imageUrl = publicUrlData.publicUrl;

            // 3. Supabase Database에 데이터 삽입
            const { error: insertError } = await supabase
                .from('works')
                .insert([{
                    title: title,
                    description: description,
                    image_url: imageUrl
                }]);

            if (insertError) throw insertError;

            // 4. 성공 후 상태 초기화 및 부모 컴포넌트(ArchiveList) 새로고침 요청
            setTitle('');
            setDescription('');
            setFile(null);

            // 파일 입력 필드를 수동으로 초기화
            (e.target as HTMLFormElement).reset();

            onWorkCreated(); // 부모 컴포넌트에 데이터 새로고침을 알립니다.

        } catch (err: any) {
            console.error('Submission Error:', err);
            setError(err.message || '작업물 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-700 rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-white">새 작업물 등록</h2>

            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                required
            />

            <textarea
                placeholder="설명 (선택 사항)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 h-24"
            />

            <input
                type="file"
                accept="image/*" // 이미지 파일만 허용
                onChange={handleFileChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                required
            />

            {error && <p className="text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={loading || !file || !title}
                className="w-full py-2 rounded font-bold transition-colors"
                style={{
                    backgroundColor: (loading || !file || !title) ? '#888' : '#6366f1',
                    color: 'white',
                }}
            >
                {loading ? '등록 중...' : '작업물 등록'}
            </button>
        </form>
    );
}

export default WorkForm;