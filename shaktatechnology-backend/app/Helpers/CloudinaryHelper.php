<?php

namespace App\Helpers;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryHelper
{
    public static function uploadImage(UploadedFile $file, string $folder = 'news'): string
    {
        $uploaded = Cloudinary::upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return $uploaded->getSecurePath();
    }

    public static function deleteImage(string $url): void
    {
        $path = parse_url($url, PHP_URL_PATH);

        $segments = explode('/', trim($path, '/'));

        $file = end($segments);

        $folder = prev($segments);

        $publicId = $folder . '/' . pathinfo($file, PATHINFO_FILENAME);

        Cloudinary::destroy($publicId);
    }
}
