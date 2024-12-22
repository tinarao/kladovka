import axios from "axios";

interface KladowkaResponse {
    ok: boolean
    code: number
    message: string
}

export class Kladowka {
    private key?: string;
    private token?: string

    constructor(key: string, token: string) {
        this.key = key;
        this.token = token;
    }

    private checkAuth() {
        if (!this.key || !this.token) {
            throw new Error("Authentication error. Check if provided key-token pair is valid")
        }
    }

    private async handleSingleFileUpload(projectId: number, file: File): Promise<KladowkaResponse> {
        this.checkAuth()

        const response = await axios.postForm(
            '/api/u/upload',
            {
                name: 'yo',
                projectId: projectId,
                file: file,
            },
            {
                headers: {
                    kl_token: this.token,
                    kl_key: this.key,
                },
            },
        );

        switch (response.status) {
            case 400:
                return { ok: false, message: "Некорректные входные данные", code: 400 };
            case 401:
                return { ok: false, message: "Ошибка авторизации", code: 401 };
            case 413:
                return { ok: false, message: "Слишком большой файл", code: 413 };
            case 500:
                return { ok: false, message: "Возникла внутренняя ошибка сервера", code: 500 };
        }

        return { ok: true, message: `Файл размером ${response.data.filesize} Мб. успешно загружен`, code: 200 }

    }

    public upload(projectId: number, ...files: Array<File>) {
        const response = this.handleSingleFileUpload(projectId, files[0]);
        return response;
    }

    public async getSignedUrl(fileId: number) {
        const response = await axios.get(
            `/api/u/url/${fileId}`,
            {
                headers: {
                    kl_token: this.token,
                    kl_key: this.key,
                },
            },
        );
        if (response.status !== 200) {
            return { ok: false }
        }

        return { ok: true, alias: response.data.signedUrl }
    }
}