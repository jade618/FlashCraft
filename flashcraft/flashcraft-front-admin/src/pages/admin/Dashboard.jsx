import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import apiAdmin from '../../services/apiAdmin';
import './Dashboard.css';

const Dashboard = () => {
  const [comprasData, setComprasData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await apiAdmin.get('/compras/daily'); // Endpoint para compras do dia
        const data = response.data;
        console.log('Dados recebidos do endpoint /compras/daily:', data);

        if (!data || data.length === 0) {
          setComprasData({
            labels: [],
            datasets: [],
          });
          return;
        }

        // Preparar dados para gráfico
        const labels = data.map(item => {
          // Adjust hour for local timezone offset
          const localHour = (item.hora - new Date().getTimezoneOffset() / 60 + 24) % 24;
          return localHour.toString().padStart(2, '0') + ':00';
        });
        const valoresTotal = data.map(item => item.total);
        const valoresQuantidade = data.map(item => item.quantidade);

        setComprasData({
          labels,
          datasets: [
            {
              label: 'Quantidade de Produtos Vendidos',
              data: valoresQuantidade,
              backgroundColor: 'rgba(202, 54, 142, 0.7)', // primary vivid with opacity for fill
              borderColor: 'var(--primaria-viva)', // primary vivid for border
              borderWidth: 1,
              yAxisID: 'y1',
            },
            {
              label: 'Total de Vendas (R$)',
              data: valoresTotal,
              backgroundColor: 'rgba(10, 42, 102, 0.7)', // primary dark with opacity for fill
              borderColor: 'var(--primaria-escura)', // primary dark for border
              borderWidth: 1,
              yAxisID: 'y',
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao buscar dados de compras:', error);
        setComprasData({
          labels: [],
          datasets: [],
        });
      }
    };

    fetchCompras();
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Compras por Hora do Dia',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.yAxisID === 'y1') {
              return `Quantidade: ${context.parsed.y}`;
            } else {
              return `R$ ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hora do Dia',
          font: {
            size: 16,
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total de Vendas (R$)',
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Quantidade de Produtos',
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="chart-container">
          <Bar data={comprasData} options={options} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
