import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  // Criação da instância do Formidable
  const form = formidable({
    multiples: true, // Permite upload de múltiplos arquivos
    uploadDir: './uploads', // Diretório onde arquivos temporários serão armazenados
    keepExtensions: true, // Mantém as extensões dos arquivos
  });

  return new Promise((resolve, reject) => {
    form.parse(event.req, async (err, fields, files) => {
      if (err) {
        // Logando erro no parsing
        console.error('Erro ao processar o arquivo com formidable:', err);
        reject({ error: 'Erro ao processar o arquivo', details: err });
        return;
      }

      // Logando os campos e arquivos
      console.log('Campos recebidos:', fields);
      console.log('Arquivos recebidos:', files);

      // Verifique se o arquivo está presente
      const file = files?.file?.[0];  // Aqui verificamos se o arquivo foi recebido corretamente
      if (!file) {
        resolve({ error: 'Nenhum arquivo encontrado' });
        return;
      }

      // Configuração do Cloudinary
      cloudinary.config({
        cloud_name: useRuntimeConfig().public.cloudinaryCloudName,
        api_key: useRuntimeConfig().cloudinaryApiKey,
        api_secret: useRuntimeConfig().cloudinaryApiSecret,
      });

      try {
        // Envia o arquivo para o Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'multiverso', // Opcional: organiza uploads em pastas
        });

        // Retorna a URL da imagem após o upload
        resolve({ url: result.secure_url });
      } catch (cloudinaryError) {
        // Logando erro no upload para o Cloudinary
        console.error('Erro ao enviar para o Cloudinary:', cloudinaryError);
        reject({ error: 'Erro ao fazer upload para o Cloudinary', details: cloudinaryError });
      }
    });
  });
});
