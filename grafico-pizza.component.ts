import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GraficoModel } from '../../models/graficoModel';


@Component({
  selector: 'app-grafico-pizza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-pizza.component.html',
  styleUrl: './grafico-pizza.component.scss',
})
export class GraficoPizzaComponent {
  @Input() pieData: GraficoModel[];
  totalValue: any;

  ngOnInit(): void {
    this.totalValue = this.pieData.reduce((acc, item) => acc + item.value, 0);
    this.calculatePie();
  }
  calculatePie() {
    let cumulativeAngle = 0;

    this.pieData = this.pieData.map((slice) => {
      const angle = (slice.value / this.totalValue) * 360;
      const percentage =
        ((slice.value / this.totalValue) * 100).toFixed(1) + '%'; // Calculando a porcentagem
      const largeArcFlag = angle > 180 ? 1 : 0;

      const startX =
        Math.cos((cumulativeAngle - 90) * (Math.PI / 180)) * 16 + 16;
      const startY =
        Math.sin((cumulativeAngle - 90) * (Math.PI / 180)) * 16 + 16;
      cumulativeAngle += angle;
      const endX = Math.cos((cumulativeAngle - 90) * (Math.PI / 180)) * 16 + 16;
      const endY = Math.sin((cumulativeAngle - 90) * (Math.PI / 180)) * 16 + 16;

      // Ponto central da fatia para o texto (usamos o meio do arco)
      const midAngle = cumulativeAngle - angle / 2;
      const textX = Math.cos((midAngle - 90) * (Math.PI / 180)) * 10 + 16; // Ajustando o raio para o texto
      const textY = Math.sin((midAngle - 90) * (Math.PI / 180)) * 10 + 16;

      const path = `
        M 16 16
        L ${startX} ${startY}
        A 16 16 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z
      `;

      return {
        ...slice,
        path,
        percentage, // Armazenando a porcentagem
        textPosition: { x: textX, y: textY }, // Posição do texto
      };
    });
  }
}
